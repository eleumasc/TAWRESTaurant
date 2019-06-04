import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { UserRole } from "../models/User";

@Injectable({
  providedIn: "root"
})
export class RootGuardService {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      if (user.role === UserRole.Waiter) {
        this.router.navigate(["/waiter/tables"]);
      } else if (user.role === UserRole.Cook) {
        this.router.navigate(["/cook/kitchen"]);
      } else if (user.role === UserRole.Barman) {
        this.router.navigate(["/barman/bar"]);
      } else if (user.role === UserRole.Cashier) {
        this.router.navigate(["/cashier/tables"]);
      }
    } else {
      this.router.navigate(["/login"]);
    }

    return false;
  }
}
