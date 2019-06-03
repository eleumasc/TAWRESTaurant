import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { MenuItem, MenuItemKind } from "../models/MenuItem";

export type GetMenuItemsFilter = { kind?: MenuItemKind };

@Injectable({
  providedIn: "root"
})
export class MenuItemsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async getMenuItems(filter: GetMenuItemsFilter): Promise<MenuItem[]> {
    return this.http
      .get(
        environment.baseUrl +
          environment.apiPath +
          `/menu${(filter.kind === MenuItemKind.Food && "/foods") ||
            (filter.kind === MenuItemKind.Beverage && "/beverages") ||
            ""}`,
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<MenuItem[]>;
  }

  async getMenuItemById(id: string): Promise<MenuItem> {
    return this.http
      .get(environment.baseUrl + environment.apiPath + `/menu/byId/${id}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        responseType: "json"
      })
      .toPromise() as Promise<MenuItem>;
  }
}
