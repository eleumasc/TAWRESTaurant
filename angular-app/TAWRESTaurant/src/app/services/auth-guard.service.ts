import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(route: ActivatedRouteSnapshot) {
    if (await this.authService.isLoggedIn()) {
      if (route.data.roles.includes((await this.authService.getUser()).role)) {
        return true;
      }

      this.router.navigate(["/home"]);

      return false;
    }

    this.router.navigate(["/login"]);

    return false;
  }
}
