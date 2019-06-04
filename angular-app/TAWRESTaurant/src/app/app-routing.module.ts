import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RootGuardService } from "./services/root-guard.service";
import { NoAuthGuardService } from "./services/no-auth-guard.service";
import { AuthGuardService } from "./services/auth-guard.service";
import { UserRole } from "./models/User";

import { LoginComponent } from "./components/login/login.component";
import { InfoComponent } from "./components/info/info.component";
import { WaiterTablesPageComponent } from "./components/waiter-tables-page/waiter-tables-page.component";
import { KitchenPageComponent } from "./components/kitchen-page/kitchen-page.component";
import { OrderKind } from "./models/Order";
import { TablesPageComponent } from "./components/tables-page/tables-page.component";
import { UsersPageComponent } from "./components/users-page/users-page.component";

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [RootGuardService] },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [NoAuthGuardService]
  },
  {
    path: "info",
    component: InfoComponent
  },
  {
    path: "waiter/tables",
    component: WaiterTablesPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Waiter]
    }
  },
  {
    path: "cook/kitchen",
    component: KitchenPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Cook],
      kind: OrderKind.FoodOrder
    }
  },
  {
    path: "barman/bar",
    component: KitchenPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Barman],
      kind: OrderKind.BeverageOrder
    }
  },
  {
    path: "cashier/tables",
    component: TablesPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Cashier]
    }
  },
  {
    path: "cashier/users",
    component: UsersPageComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [UserRole.Cashier]
    }
  },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
