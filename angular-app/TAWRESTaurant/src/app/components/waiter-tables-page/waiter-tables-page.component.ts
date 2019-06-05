import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { OrdersService } from "src/app/services/orders.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OccupyTableModalContentComponent } from "../occupy-table-modal-content/occupy-table-modal-content.component";
import { TakeOrdersModalContentComponent } from "../take-orders-modal-content/take-orders-modal-content.component";
import { Table } from "src/app/models/Table";
import { OrderKind } from "src/app/models/Order";

@Component({
  selector: "app-waiter-tables-page",
  templateUrl: "./waiter-tables-page.component.html",
  styleUrls: ["./waiter-tables-page.component.css"]
})
export class WaiterTablesPageComponent implements OnInit {
  servedBy: string;

  constructor(
    private authService: AuthService,
    private ordersService: OrdersService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.servedBy = this.authService.getUser()._id;
  }

  openOccupyTableModal() {
    this.modalService.open(OccupyTableModalContentComponent);
  }

  openTakeOrdersModal(table: Table) {
    const modalRef = this.modalService.open(TakeOrdersModalContentComponent);

    modalRef.componentInstance.table = table;
  }

  serveOrders(table: Table, kind: OrderKind) {
    this.ordersService
      .serveOrders(table, kind)
      .then(() => {})
      .catch(err => {
        alert(err.message);
      });
  }
}
