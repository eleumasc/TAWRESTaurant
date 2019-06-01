import { isUserRole } from "../user";

export type CreateUserForm = {
  username: String;
  name: String;
  surname: String;
  role: String;
  password: String;
};

export function isCreateUserForm(req: any): req is CreateUserForm {
  return (
    req.body &&
    req.body.username &&
    typeof req.body.username === "string" &&
    req.body.name &&
    typeof req.body.name === "string" &&
    req.body.surname &&
    typeof req.body.surname === "string" &&
    req.body.role &&
    isUserRole(req.body.role) &&
    req.body.password &&
    typeof req.body.password === "string"
  );
}

export type ChangePasswordForm = {
  password: string;
};

export function isChangePassword(req: any): req is ChangePasswordForm {
  return req.body && req.body.password && typeof req.body.password === "string";
}
