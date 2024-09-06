import { useSession } from "next-auth/react";
import { UserRole } from "../../types";
import permissions from "../config/permissions.json";

type Permissions = {
  accessReviews: boolean;
  accessUsers: boolean;
  accessTranscription: boolean;
  resetReviews: boolean;
  archiveTranscripts: boolean;
  accessTransactions: boolean;
  accessAdminNav: boolean;
  submitToOwnRepo: boolean;
};

export const useHasPermission = (permission: keyof Permissions) => {
  const { data: userSession } = useSession();
  const userRole = userSession?.user?.permissions as UserRole;
  const userPermissions = permissions[userRole];

  return !!userPermissions?.[permission];
};
