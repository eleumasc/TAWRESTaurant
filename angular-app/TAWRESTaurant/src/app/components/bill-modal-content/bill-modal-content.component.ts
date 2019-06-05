import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { OrdersService } from "src/app/services/orders.service";
import { TablesService } from "src/app/services/tables.service";
import { Table } from "src/app/models/Table";
import {
  OrderKind,
  Order,
  FoodOrder,
  BeverageOrder
} from "src/app/models/Order";

@Component({
  selector: "app-bill-modal-content",
  templateUrl: "./bill-modal-content.component.html",
  styleUrls: ["./bill-modal-content.component.css"]
})
export class BillModalContentComponent implements OnInit {
  @Input() table: Table;

  orders: Order[];

  totalPrice: number = 0;

  constructor(
    private activeModal: NgbActiveModal,
    private ordersService: OrdersService,
    private tablesService: TablesService
  ) {}

  ngOnInit() {
    this.ordersService
      .getOrders({ table: this.table._id })
      .then((orders: Order[]) => {
        this.orders = orders;
        this.totalPrice = this.orders.reduce(
          (acc: number, order: Order) =>
            acc +
            (order.kind === OrderKind.FoodOrder
              ? (<FoodOrder>order).food.price
              : (<BeverageOrder>order).beverage.price),
          0
        );
      })
      .catch(err => {
        alert(err.message);
      });
  }

  freeTable() {
    this.tablesService
      .freeTable(this.table)
      .then(() => {
        this.activeModal.close();
      })
      .catch(err => {
        alert(err.message);
      });
  }
}
