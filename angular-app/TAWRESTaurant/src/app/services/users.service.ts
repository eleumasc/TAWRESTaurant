import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { UserRole, User } from "src/app/models/User";

export type GetUsersFilter = {
  username?: string;
  role?: UserRole;
};

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getCreateUserPathByUserRole(role: UserRole): string {
    switch (role) {
      case UserRole.Waiter:
        return "/users/waiters";
      case UserRole.Cook:
        return "/users/cooks";
      case UserRole.Barman:
        return "/users/barmans";
      case UserRole.Cashier:
        return "/users/cashiers";
    }
  }

  private getGetUsersHttpParamsByFilter(
    filter: GetUsersFilter
  ): {
    [param: string]: string | string[];
  } {
    const params: {
      [param: string]: string | string[];
    } = {};
    if (filter.username) {
      params["username"] = filter.username;
    }
    if (filter.role) {
      params["role"] = filter.role;
    }
    return params;
  }

  async getUsers(filter: GetUsersFilter): Promise<User[]> {
    return this.http
      .get(environment.baseUrl + environment.apiPath + "/users", {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        params: this.getGetUsersHttpParamsByFilter(filter),
        responseType: "json"
      })
      .toPromise() as Promise<User[]>;
  }

  async getUserById(id: string): Promise<User> {
    return this.http
      .get(environment.baseUrl + environment.apiPath + `/users/byId/${id}`, {
        headers: new HttpHeaders({
          Authorization: "Bearer " + (await this.authService.getToken())
        }),
        responseType: "json"
      })
      .toPromise() as Promise<User>;
  }

  async createUser(form: {
    username: string;
    name: string;
    surname: string;
    password: string;
    role: UserRole;
  }): Promise<User> {
    return this.http
      .post(
        environment.baseUrl +
          environment.apiPath +
          this.getCreateUserPathByUserRole(form.role),
        form,
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<User>;
  }

  async changePassword(
    user: User,
    form: { password: string }
  ): Promise<undefined> {
    return this.http
      .put(
        environment.baseUrl +
          environment.apiPath +
          `/users/byId/${user._id}/password`,
        form,
        {
          headers: new HttpHeaders({
            Authorization: "Bearer " + (await this.authService.getToken())
          }),
          responseType: "json"
        }
      )
      .toPromise() as Promise<undefined>;
  }

  async deleteUser(user: User): Promise<undefined> {
    return this.http
      .delete(
        environment.baseUrl + environment.apiPath + `/users/byId/${user._id}`,
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
