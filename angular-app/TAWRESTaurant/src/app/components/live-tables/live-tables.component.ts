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
  TablesService,
  GetTablesFilter,
  GetTablesSortRule
} from "src/app/services/tables.service";
import { EventsService } from "src/app/services/events.service";
import { Table } from "src/app/models/Table";

@Component({
  selector: "app-live-tables",
  templateUrl: "./live-tables.component.html",
  styleUrls: ["./live-tables.component.css"]
})
export class LiveTablesComponent implements OnInit, OnDestroy {
  @ContentChild(TemplateRef, { static: false }) templateOutlet;

  @Input() filter: GetTablesFilter;

  @Input() sort: [GetTablesSortRule];

  loading: boolean = true;

  tables: Table[] = [];

  eventsSub: Subscription;

  constructor(
    private tablesService: TablesService,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    this.tablesService.getTables(this.filter).then((tables: Table[]) => {
      this.loading = false;

      this.tables = tables;
      if (this.tables.length > 0) {
        this.tables.sort(this.compareTables(this.sort));
      }

      this.eventsSub = this.eventsService
        .getTablesEvents()
        .subscribe((table: Table) => {
          const tableInList = this.tables.find(
            table1 => table._id === table1._id
          );

          if (tableInList) {
            const tableInListIdx = this.tables.indexOf(tableInList);
            this.tables.splice(tableInListIdx, 1);
          }

          if (this.tableIsFiltered(table)) {
            this.tables.push(table);
            this.tables.sort(this.compareTables(this.sort));
          }
        });
    });
  }

  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }
  }

  private tableIsFiltered(table: Table) {
    return (
      (!this.filter.seats || table.seats >= this.filter.seats) &&
      (!this.filter.status || table.status === this.filter.status) &&
      (!this.filter.servedBy || table.servedBy === this.filter.servedBy) &&
      (!this.filter.foodOrdersStatus ||
        table.foodOrdersStatus === this.filter.foodOrdersStatus) &&
      (!this.filter.beverageOrdersStatus ||
        table.beverageOrdersStatus === this.filter.beverageOrdersStatus)
    );
  }

  private compareTables(
    sortRules: [GetTablesSortRule]
  ): (a: Table, b: Table) => number {
    return function(a: Table, b: Table): number {
      for (let rule of sortRules) {
        let aVal, bVal;
        switch (rule.by) {
          case "number":
          case "seats":
            aVal = a[rule.by];
            bVal = b[rule.by];
            break;
          case "occupiedAt":
          case "ordersTakenAt":
            aVal = new Date(a[rule.by]).getTime();
            bVal = new Date(b[rule.by]).getTime();
            break;
        }
        const result = aVal < bVal ? -1 : aVal === bVal ? 0 : 1;
        if (result !== 0) {
          return !rule.desc ? result : -result;
        }
      }
      return 0;
    };
  }
}
