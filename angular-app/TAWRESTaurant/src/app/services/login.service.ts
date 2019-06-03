import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(private http: HttpClient) {}

  async login(username: string, password: string): Promise<{ token: string }> {
    return this.http
      .post(environment.baseUrl + environment.apiPath + "/login", null, {
        headers: new HttpHeaders({
          Authorization: "Basic " + btoa(username + ":" + password)
        }),
        responseType: "json"
      })
      .toPromise() as Promise<{ token: string }>;
  }
}
