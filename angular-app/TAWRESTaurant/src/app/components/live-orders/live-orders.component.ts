import {
  Component,
  OnInit,
  OnDestroy,
  ContentChild,
  TemplateRef,
  Input
} from "@angular/core";
import { Subscription } from "rxjs";
import {
  OrdersService,
  GetOrdersFilter,
  GetOrdersSortRule
} from "src/app/services/orders.service";
import { EventsService } from "src/app/services/events.service";
import { Order, FoodOrder, BeverageOrder } from "src/app/models/Order";
import { MenuItem } from "src/app/models/MenuItem";

@Component({
  selector: "app-live-orders",
  templateUrl: "./live-orders.component.html",
  styleUrls: ["./live-orders.component.css"]
})
export class LiveOrdersComponent implements OnInit, OnDestroy {
  @ContentChild(TemplateRef, { static: false }) templateOutlet;

  @Input() filter: GetOrdersFilter;

  @Input() sort: [GetOrdersSortRule];

  loading: boolean = true;

  orders: Order[] = [];

  eventsSub: Subscription;

  constructor(
    private ordersService: OrdersService,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    this.ordersService.getOrders(this.filter).then((orders: Order[]) => {
      this.loading = false;

      this.orders = orders;
      if (this.orders.length > 0) {
        this.orders.sort(this.compareOrders(this.sort));
      }

      this.eventsSub = this.eventsService
        .getOrdersEvents()
        .subscribe((order: Order) => {
          const orderInList = this.orders.find(
            order1 => order._id === order1._id
          );

          if (orderInList) {
            const orderInListIdx = this.orders.indexOf(orderInList);
            this.orders.splice(orderInListIdx, 1);
          }

          if (this.orderIsFiltered(order)) {
            this.orders.push(order);
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }
  }

  private orderIsFiltered(order: Order) {
    return (
      (!this.filter.table || order.table === this.filter.table) &&
      (!this.filter.status || order.status === this.filter.status) &&
      (!this.filter.kind || order.kind === this.filter.kind) &&
      (!this.filter.cook || (<FoodOrder>order).cook === this.filter.cook) &&
      (!this.filter.barman ||
        (<BeverageOrder>order).barman === this.filter.barman)
    );
  }

  private compareOrders(
    sortRules: [GetOrdersSortRule]
  ): (a: Order, b: Order) => number {
    return function(a: Order, b: Order): number {
      for (let rule of sortRules) {
        let result = 0;
        switch (rule.by) {
          case "price":
          case "preparationTime": {
            const aMenuItem: MenuItem =
              (<FoodOrder>a).food || (<BeverageOrder>a).beverage;
            const bMenuItem: MenuItem =
              (<FoodOrder>b).food || (<BeverageOrder>b).beverage;
            result =
              aMenuItem[rule.by] < bMenuItem[rule.by]
                ? -1
                : aMenuItem[rule.by] === bMenuItem[rule.by]
                ? 0
                : 1;
          }
        }
        if (result !== 0) {
          return !rule.desc ? result : -result;
        }
      }
      return 0;
    };
  }
}
