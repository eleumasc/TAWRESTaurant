import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TablesService } from "src/app/services/tables.service";

@Component({
  selector: "app-occupy-table-modal-content",
  templateUrl: "./occupy-table-modal-content.component.html",
  styleUrls: ["./occupy-table-modal-content.component.css"]
})
export class OccupyTableModalContentComponent implements OnInit {
  numOfCustomers: number;

  searching: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private tablesService: TablesService
  ) {}

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
        this.activeModal.close();
      })
      .catch(err => {
        alert(err);
      });
  }
}
