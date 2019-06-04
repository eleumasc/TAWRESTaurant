import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/models/User";

@Component({
  selector: "app-navs-pages",
  templateUrl: "./navs-pages.component.html",
  styleUrls: ["./navs-pages.component.css"]
})
export class NavsPagesComponent implements OnInit {
  @Input() auth: User;

  constructor() {}

  ngOnInit() {}
}
