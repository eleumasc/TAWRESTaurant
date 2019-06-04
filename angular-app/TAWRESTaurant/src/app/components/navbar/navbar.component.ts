import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/User";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  isNavbarCollapsed: boolean = true;

  auth: User = null;

  authSubjectSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.auth = this.authService.getUser();
    this.authSubjectSubscription = this.authService
      .getAuthSubject()
      .subscribe(auth => {
        this.auth = auth;
      });
  }

  ngOnDestroy() {
    this.authSubjectSubscription.unsubscribe();
  }
}
