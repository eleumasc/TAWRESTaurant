import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loading: boolean = false;

  alert: { type: string; message: string } = null;

  password;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  onSubmit(form) {
    this.loading = true;
    this.alert = null;

    const formValue = form.form.value;

    this.loginService
      .login(formValue.username, formValue.password)
      .then(res => {
        this.authService.setToken(res.token);
        this.router.navigate(["/"]);
      })
      .catch(err => {
        this.loading = false;
        form.password = "";
        this.alert = {
          type: "warning",
          message: err.error.message || err.message || err
        };
      });
  }
}
