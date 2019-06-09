import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/models/User";

@Component({
  selector: "app-user-content",
  templateUrl: "./user-content.component.html",
  styleUrls: ["./user-content.component.css"]
})
export class UserContentComponent implements OnInit {
  @Input() user: User;

  @Input() show: { stats?: boolean };

  constructor() {}

  ngOnInit() {}
}
