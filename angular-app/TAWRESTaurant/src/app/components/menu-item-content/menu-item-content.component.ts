import { Component, OnInit, Input } from "@angular/core";
import { MenuItem } from "src/app/models/MenuItem";

@Component({
  selector: "app-menu-item-content",
  templateUrl: "./menu-item-content.component.html",
  styleUrls: ["./menu-item-content.component.css"]
})
export class MenuItemContentComponent implements OnInit {
  @Input() menuItem: MenuItem;

  @Input() show: {};

  constructor() {}

  ngOnInit() {}
}
