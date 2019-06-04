import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class NoAuthGuardService {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/"]);
      return false;
    }

    return true;
  }
}
