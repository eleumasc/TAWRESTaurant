import { Component, OnInit } from "@angular/core";
import { TablesService } from "src/app/services/tables.service";

@Component({
  selector: "app-free-tables-page",
  templateUrl: "./free-tables-page.component.html",
  styleUrls: ["./free-tables-page.component.css"]
})
export class FreeTablesPageComponent implements OnInit {
  numOfCustomers: number;

  constructor(private tablesService: TablesService) {}

  ngOnInit() {}

  occupyTable(table) {
    this.tablesService
      .occupyTable(table, this.numOfCustomers)
      .then(() => {
        alert("Hai occupato il tavolo " + table.number);
      })
      .catch(() => {
        alert("Si è verificato un errore");
      });
  }
}
