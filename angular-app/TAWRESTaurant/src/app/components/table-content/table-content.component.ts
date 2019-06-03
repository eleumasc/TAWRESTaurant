import { Component, OnInit, Input } from "@angular/core";
import { Table } from "src/app/models/Table";

@Component({
  selector: "app-table-content",
  templateUrl: "./table-content.component.html",
  styleUrls: ["./table-content.component.css"]
})
export class TableContentComponent implements OnInit {
  @Input() table: Table;

  @Input() show: {
    seats?: boolean;
    status?: boolean;
    foodOrdersStatus?: boolean;
    beverageOrdersStatus?: boolean;
  };

  constructor() {}

  ngOnInit() {}
}
