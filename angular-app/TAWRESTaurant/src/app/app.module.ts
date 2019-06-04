import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";

import { AuthService } from "src/app/services/auth.service";
import { NoAuthGuardService } from "./services/no-auth-guard.service";
import { AuthGuardService } from "./services/auth-guard.service";
import { LoginService } from "src/app/services/login.service";
import { UsersService } from "src/app/services/users.service";
import { MenuItemsService } from "./services/menu-items.service";
import { TablesService } from "./services/tables.service";
import { OrdersService } from "./services/orders.service";
import { EventsService } from "./services/events.service";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { NavsCashierComponent } from "./components/navs-cashier/navs-cashier.component";
import { NavUserProfileComponent } from "./components/nav-user-profile/nav-user-profile.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { UserContentComponent } from "./components/user-content/user-content.component";
import { MenuItemContentComponent } from "./components/menu-item-content/menu-item-content.component";
import { TableContentComponent } from "./components/table-content/table-content.component";
import { OrderContentComponent } from "./components/order-content/order-content.component";
import { LiveTablesComponent } from "./components/live-tables/live-tables.component";
import { LiveOrdersComponent } from "./components/live-orders/live-orders.component";
import { UsersPageComponent } from "./components/users-page/users-page.component";
import { CreateUserModalContentComponent } from "./components/create-user-modal-content/create-user-modal-content.component";
import { ChangePasswordModalContentComponent } from "./components/change-password-modal-content/change-password-modal-content.component";
import { TablesPageComponent } from "./components/tables-page/tables-page.component";
import { BillModalContentComponent } from "./components/bill-modal-content/bill-modal-content.component";
import { WaiterTablesPageComponent } from "./components/waiter-tables-page/waiter-tables-page.component";
import { OccupyTableModalContentComponent } from "./components/occupy-table-modal-content/occupy-table-modal-content.component";
import { TakeOrdersModalContentComponent } from "./components/take-orders-modal-content/take-orders-modal-content.component";
import { KitchenPageComponent } from "./components/kitchen-page/kitchen-page.component";
import { InfoComponent } from './components/info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavsCashierComponent,
    NavUserProfileComponent,
    LoginComponent,
    HomeComponent,
    UserContentComponent,
    MenuItemContentComponent,
    TableContentComponent,
    OrderContentComponent,
    LiveTablesComponent,
    LiveOrdersComponent,
    UsersPageComponent,
    CreateUserModalContentComponent,
    ChangePasswordModalContentComponent,
    TablesPageComponent,
    BillModalContentComponent,
    WaiterTablesPageComponent,
    OccupyTableModalContentComponent,
    TakeOrdersModalContentComponent,
    KitchenPageComponent,
    InfoComponent
  ],
  entryComponents: [
    CreateUserModalContentComponent,
    ChangePasswordModalContentComponent,
    BillModalContentComponent,
    OccupyTableModalContentComponent,
    TakeOrdersModalContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    NoAuthGuardService,
    AuthGuardService,
    LoginService,
    UsersService,
    MenuItemsService,
    TablesService,
    OrdersService,
    EventsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
