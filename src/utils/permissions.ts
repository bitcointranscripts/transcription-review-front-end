import { UserRole } from "../../types";

enum Privileges {
  REVIEWER = 0,
  EVALUATOR,
  ADMIN,
}

export const checkPermissionPrivileges = (
  userRole: UserRole,
  minRole: UserRole
): boolean => {
  const rolePermissions = (role: UserRole) => {
    switch (role) {
      case "evaluator":
        return Privileges.EVALUATOR;

      case "admin":
        return Privileges.ADMIN;

      default:
        return Privileges.REVIEWER;
    }
  };

  const isPermitted = rolePermissions(userRole) >= rolePermissions(minRole);

  return isPermitted;
};
