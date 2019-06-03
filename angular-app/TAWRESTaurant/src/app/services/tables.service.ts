import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { Waiter } from "../models/User";
import { Table, TableStatus, TableOrderStatus } from "../models/Table";

export type GetTablesFilter = {
  seats?: number;
  status?: TableStatus;
  servedBy?: string;
  foodOrdersStatus?: TableOrderStatus;
  beverageOrdersStatus?: TableOrderStatus;
};

export type GetTablesSortRule = {
  by: "number" | "seats" | "occupiedAt" | "ordersTakenAt";
  desc?: boolean;
};

@Injectable({
  providedIn: "root"
})
export class TablesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getGetTablesHttpParamsByFilter(
    filter: GetTablesFilter
  ): {
    [param: string]: string | string[];
  } {
    const params: {
      [param: string]: string | string[];
    } = {};
    if (filter.seats) {
      params["seats"] = "" + filter.seats;
    }
    if (filter.status) {
      params["status"] = filter.status;
    }
    if (filter.servedBy) {
      params["servedBy"] = filter.servedBy;
    }
    if (filter.foodOrdersStatus) {
      params["foodOrdersStatus"] = filter.foodOrdersStatus;
    }
    if (filter.beverageOrdersStatus) {
      params["beverageOrdersStatus"] = filter.beverageOrdersStatus;
    }
    return params;
  }

  async getTables(filter: GetTablesFilter): Promise<Table[]> {
    return this.http
      .get(environment.baseUrl + environment.apiPath + "/tables", {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        params: this.getGetTablesHttpParamsByFilter(filter),
        responseType: "json"
      })
      .toPromise() as Promise<Table[]>;
  }

  async getTableById(id: string): Promise<Table> {
    return this.http
      .get(environment.baseUrl + environment.apiPath + `/tables/byId/${id}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        responseType: "json"
      })
      .toPromise() as Promise<Table>;
  }

  async occupyTable(table: Table, numOfCustomers: number): Promise<undefined> {
    return this.http
      .put(
        environment.baseUrl + environment.apiPath + `/tables/byId/${table._id}`,
        { numOfCustomers: numOfCustomers },
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          params: { action: "occupy" },
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async freeTable(table: Table): Promise<undefined> {
    return this.http
      .put(
        environment.baseUrl + environment.apiPath + `/tables/byId/${table._id}`,
        {},
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          params: { action: "free" },
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }
}
