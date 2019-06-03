import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { OrdersService } from "src/app/services/orders.service";
import { MenuItemsService } from "src/app/services/menu-items.service";
import { Table } from "src/app/models/Table";
import { Order } from "src/app/models/Order";
import {
  MenuItemKind,
  MenuItem,
  Food,
  Beverage
} from "src/app/models/MenuItem";

@Component({
  selector: "app-take-orders-modal-content",
  templateUrl: "./take-orders-modal-content.component.html",
  styleUrls: ["./take-orders-modal-content.component.css"]
})
export class TakeOrdersModalContentComponent implements OnInit {
  @Input() table: Table;

  menuItems: MenuItem[];

  constructor(
    private activeModal: NgbActiveModal,
    private ordersService: OrdersService,
    private menuItemsService: MenuItemsService
  ) {}

  ngOnInit() {
    this.menuItemsService.getMenuItems({}).then(menuItems => {
      this.menuItems = menuItems;
    });
  }

  addOrder(menuItem: MenuItem) {
    this.ordersService.addOrder(
      this.table,
      menuItem.kind === MenuItemKind.Food
        ? { food: <Food>menuItem }
        : { beverage: <Beverage>menuItem }
    );
  }

  deleteOrder(order: Order) {
    this.ordersService
      .deleteOrder(this.table, order)
      .then(() => {})
      .catch(() => {
        alert("Si è verificato un errore");
      });
  }

  commitOrders() {
    if (
      confirm(
        "Sei veramente sicuro di voler consegnare gli ordini in cucina/bar?"
      )
    ) {
      this.ordersService
        .commitOrders(this.table)
        .then(() => {
          this.activeModal.close();
        })
        .catch(() => {
          alert("Si è verificato un errore");
        });
    }
  }
}
