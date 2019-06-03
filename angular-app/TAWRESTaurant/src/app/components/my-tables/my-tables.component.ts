import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { OrdersService } from "src/app/services/orders.service";
import { OrderKind } from "src/app/models/Order";
import { Table } from "src/app/models/Table";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TakeOrdersModalContentComponent } from "../take-orders-modal-content/take-orders-modal-content.component";

@Component({
  selector: "app-my-tables",
  templateUrl: "./my-tables.component.html",
  styleUrls: ["./my-tables.component.css"]
})
export class MyTablesComponent implements OnInit {
  servedBy: string;

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.servedBy = this.authService.getUser()._id;
  }

  openTakeOrdersModal(table: Table) {
    const modalRef = this.modalService.open(TakeOrdersModalContentComponent);

    modalRef.componentInstance.table = table;
  }

  notifyServed(table: Table, kind: OrderKind) {
    this.ordersService
      .notifyServedOrders(table, kind)
      .then(() => {})
      .catch(() => {
        alert("Si è verificato un errore");
      });
  }
}
