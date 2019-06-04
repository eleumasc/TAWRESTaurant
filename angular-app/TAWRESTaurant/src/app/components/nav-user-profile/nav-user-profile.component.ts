import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/models/User";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-nav-user-profile",
  templateUrl: "./nav-user-profile.component.html",
  styleUrls: ["./nav-user-profile.component.css"]
})
export class NavUserProfileComponent implements OnInit {
  @Input() auth: User;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.authService.clearToken();
    this.router.navigate(["/login"]);
  }
}
