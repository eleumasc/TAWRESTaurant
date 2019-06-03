import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { Cook, Barman } from "../models/User";
import { Order, OrderKind, OrderStatus } from "../models/Order";
import { Table } from "../models/Table";
import { Food, Beverage } from "../models/MenuItem";

export type GetOrdersFilter =
  | {
      table: string;
      kind?: OrderKind;
      status?: OrderStatus;
      cook?: undefined;
      barman?: undefined;
    }
  | {
      table?: undefined;
      kind?: OrderKind.FoodOrder;
      status?: OrderStatus.Preparing | OrderStatus.Ready;
      cook: string;
      barman?: undefined;
    }
  | {
      table?: undefined;
      kind?: OrderKind.BeverageOrder;
      status?: OrderStatus.Preparing | OrderStatus.Ready;
      cook?: undefined;
      barman: string;
    };

export type GetOrdersSortRule = {
  by: "price" | "preparationTime";
  desc?: boolean;
};

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getGetOrdersPathByFilter(filter: GetOrdersFilter): string {
    if (filter.cook) {
      return `/users/cooks/byId/${filter.cook}/orders`;
    } else if (filter.barman) {
      return `/users/barmans/byId/${filter.barman}/orders`;
    } else {
      let path = `/tables/byId/${filter.table}/orders`;
      if (filter.status) {
        if (filter.kind === OrderKind.FoodOrder) {
          path += "/foodOrders";
        } else if (filter.kind === OrderKind.BeverageOrder) {
          path += "/beverageOrders";
        }
      }
      return path;
    }
  }

  private getGetOrdersHttpParamsByFilter(
    filter: GetOrdersFilter
  ): {
    [param: string]: string | string[];
  } {
    const params: {
      [param: string]: string | string[];
    } = {};
    if (filter.status) {
      params["status"] = filter.status;
    }
    return params;
  }

  async getOrders(filter: GetOrdersFilter): Promise<Order[]> {
    return this.http
      .get(
        environment.baseUrl +
          environment.apiPath +
          this.getGetOrdersPathByFilter(filter),
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          params: this.getGetOrdersHttpParamsByFilter(filter),
          responseType: "json"
        }
      )
      .toPromise() as Promise<Order[]>;
  }

  async getOrderById(table: Table, id: string): Promise<Order> {
    return this.http
      .get(
        environment.baseUrl +
          environment.apiPath +
          `/tables/byId/${table._id}/orders/byId/${id}`,
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<Order>;
  }

  async addOrder(
    table: Table,
    form:
      | { food: Food; beverage?: undefined }
      | { food?: undefined; beverage: Beverage }
  ) {
    return this.http
      .post(
        environment.baseUrl +
          environment.apiPath +
          `/tables/byId/${table._id}/orders${
            form.food ? "/foodOrders" : "/beverageOrders"
          }`,
        {
          food: form.food && form.food._id,
          beverage: form.beverage && form.beverage._id
        },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<Order>;
  }

  async commitOrders(table: Table): Promise<undefined> {
    return this.http
      .put(
        environment.baseUrl +
          environment.apiPath +
          `/tables/byId/${table._id}/orders`,
        { action: "commit" },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async notifyServedOrders(table: Table, kind: OrderKind): Promise<undefined> {
    return this.http
      .put(
        environment.baseUrl +
          environment.apiPath +
          `/tables/byId/${table._id}/orders${
            kind === OrderKind.FoodOrder ? "/foodOrders" : "/beverageOrders"
          }`,
        { action: "notify-served" },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async assignOrder(table: Table, order: Order): Promise<undefined> {
    return this.http
      .put(
        environment.baseUrl +
          environment.apiPath +
          `/tables/byId/${table._id}/orders${
            order.kind === OrderKind.FoodOrder
              ? "/foodOrders"
              : "/beverageOrders"
          }/byId/${order._id}`,
        { action: "assign" },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async notifyReadyOrder(table: Table, order: Order): Promise<undefined> {
    return this.http
      .put(
        environment.baseUrl +
          environment.apiPath +
          `/tables/byId/${table._id}/orders${
            order.kind === OrderKind.FoodOrder
              ? "/foodOrders"
              : "/beverageOrders"
          }/byId/${order._id}`,
        { action: "notify-ready" },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async deleteOrder(table: Table, order: Order): Promise<undefined> {
    return this.http
      .delete(
        environment.baseUrl +
          environment.apiPath +
          `/tables/byId/${table._id}/orders/byId/${order._id}`,
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }
}
