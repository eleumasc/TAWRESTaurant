import { Component, OnInit } from "@angular/core";
import { UsersService } from "src/app/services/users.service";
import { User } from "src/app/models/User";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CreateUserModalContentComponent } from "../create-user-modal-content/create-user-modal-content.component";
import { ChangePasswordModalContentComponent } from "../change-password-modal-content/change-password-modal-content.component";

@Component({
  selector: "app-users-page",
  templateUrl: "./users-page.component.html",
  styleUrls: ["./users-page.component.css"]
})
export class UsersPageComponent implements OnInit {
  users: User[] = null;

  constructor(
    private usersService: UsersService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.usersService.getUsers({}).then(users => {
      this.users = users;
    });
  }

  addUser() {
    this.modalService
      .open(CreateUserModalContentComponent)
      .result.then(form => {
        this.usersService.createUser(form).then((user: User) => {
          this.users.push(user);
        });
      })
      .catch(() => {});
  }

  changePassword(user) {
    const modalRef = this.modalService.open(
      ChangePasswordModalContentComponent
    );

    modalRef.componentInstance.user = user;

    modalRef.result
      .then(form => {
        this.usersService.changePassword(user, form).then(() => {
          alert(
            'La password di "' +
              user.username +
              '" è stata cambiata con successo.'
          );
        });
      })
      .catch(() => {});
  }

  deleteUser(user) {
    if (
      confirm(
        'Sei veramente sicuro di voler eliminare "' + user.username + '"?'
      )
    ) {
      this.usersService.deleteUser(user).then(() => {
        this.users = this.users.filter(user1 => user._id !== user1._id);
      });
    }
  }
}
