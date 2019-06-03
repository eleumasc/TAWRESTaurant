import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserRole } from "./models/User";
import { NoAuthGuardService } from "./services/no-auth-guard.service";
import { AuthGuardService } from "./services/auth-guard.service";

import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { UsersPageComponent } from "./components/users-page/users-page.component";
import { TablesPageComponent } from "./components/tables-page/tables-page.component";
import { FreeTablesPageComponent } from "./components/free-tables-page/free-tables-page.component";
import { MyTablesComponent } from "./components/my-tables/my-tables.component";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [NoAuthGuardService]
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Waiter, UserRole.Cook, UserRole.Barman, UserRole.Cashier]
    }
  },
  {
    path: "users",
    component: UsersPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Cashier]
    }
  },
  {
    path: "tables",
    component: TablesPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Cashier]
    }
  },
  {
    path: "free-tables",
    component: FreeTablesPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Waiter]
    }
  },
  {
    path: "my-tables",
    component: MyTablesComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Waiter]
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
