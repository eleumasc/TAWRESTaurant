import { Component, OnInit } from "@angular/core";
import { TablesService } from "src/app/services/tables.service";

@Component({
  selector: "app-free-tables-page",
  templateUrl: "./free-tables-page.component.html",
  styleUrls: ["./free-tables-page.component.css"]
})
export class FreeTablesPageComponent implements OnInit {
  numOfCustomers: number;

  searching: boolean = false;

  constructor(private tablesService: TablesService) {}

  ngOnInit() {}

  search() {
    this.searching = true;
  }

  cancelSearch() {
    this.searching = false;
  }

  occupyTable(table) {
    this.tablesService
      .occupyTable(table, this.numOfCustomers)
      .then(() => {
        setTimeout(() => {
          alert("Hai occupato il tavolo " + table.number);
        }, 250);
      })
      .catch(() => {
        alert("Si è verificato un errore");
      });
  }
}
