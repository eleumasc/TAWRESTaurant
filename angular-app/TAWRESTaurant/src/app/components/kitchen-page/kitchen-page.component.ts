import { Component, OnInit } from "@angular/core";
import { OrdersService } from "src/app/services/orders.service";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/User";
import { Table } from "src/app/models/Table";
import { Order } from "src/app/models/Order";

@Component({
  selector: "app-kitchen-page",
  templateUrl: "./kitchen-page.component.html",
  styleUrls: ["./kitchen-page.component.css"]
})
export class KitchenPageComponent implements OnInit {
  auth: User;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.auth = this.authService.getUser();
  }

  assignOrder(table: Table, order: Order) {
    this.ordersService
      .assignOrder(table, order)
      .then(() => {})
      .catch(err => {
        alert(err.message);
      });
  }

  notifyOrder(table: Table, order: Order) {
    this.ordersService
      .notifyOrder(table, order)
      .then(() => {})
      .catch(err => {
        alert(err.message);
        console.log(order);
      });
  }
}
