import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BillModalContentComponent } from "../bill-modal-content/bill-modal-content.component";
import { Table } from "src/app/models/Table";

@Component({
  selector: "app-tables-page",
  templateUrl: "./tables-page.component.html",
  styleUrls: ["./tables-page.component.css"]
})
export class TablesPageComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  openBillModal(table: Table) {
    const modalRef = this.modalService.open(BillModalContentComponent);

    modalRef.componentInstance.table = table;
  }
}
