import { Component, OnInit, Input } from "@angular/core";
import { Order } from "src/app/models/Order";

@Component({
  selector: "app-order-content",
  templateUrl: "./order-content.component.html",
  styleUrls: ["./order-content.component.css"]
})
export class OrderContentComponent implements OnInit {
  @Input() order: Order;

  @Input() show: {
    status?: boolean;
    price?: boolean;
    preparationTime?: boolean;
  };

  constructor() {}

  ngOnInit() {}
}
