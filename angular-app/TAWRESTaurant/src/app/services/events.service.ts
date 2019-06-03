import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class EventsService {
  private socket;

  private observersCount: number = 0;

  constructor(private authService: AuthService) {}

  private observeFor(eventName: string) {
    return new Observable(observer => {
      if (this.observersCount++ < 1) {
        this.socket = io.connect(environment.baseUrl, {
          path: environment.apiPath + "/events",
          query: `auth_token=${this.authService.getToken()}`
        });
      }

      this.socket.on(eventName, data => {
        observer.next(data);
      });

      return () => {
        if (--this.observersCount < 1) {
          this.socket.disconnect();
        }
      };
    });
  }

  getTablesEvents() {
    return this.observeFor("table status changed");
  }

  getOrdersEvents() {
    return this.observeFor("order status changed");
  }
}
