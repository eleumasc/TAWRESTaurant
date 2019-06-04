import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-user-content",
  templateUrl: "./user-content.component.html",
  styleUrls: ["./user-content.component.css"]
})
export class UserContentComponent implements OnInit {
  @Input() user;

  @Input() show;

  constructor() {}

  ngOnInit() {}
}
