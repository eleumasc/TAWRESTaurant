import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.authService.isLoggedIn()) {
      if (route.data.roles.includes(this.authService.getUser().role)) {
        return true;
      }

      this.router.navigate(["/"]);

      return false;
    }

    this.router.navigate(["/login"]);

    return false;
  }
}
