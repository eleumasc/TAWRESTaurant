import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-menu-item-content",
  templateUrl: "./menu-item-content.component.html",
  styleUrls: ["./menu-item-content.component.css"]
})
export class MenuItemContentComponent implements OnInit {
  @Input() menuItem;

  constructor() {}

  ngOnInit() {}
}
