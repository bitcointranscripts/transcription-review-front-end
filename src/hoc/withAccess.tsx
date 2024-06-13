import { UserRole } from "../../types";
import { ComponentType } from "react";
import { useSession } from "next-auth/react";
import { checkPermissionPrivileges } from "@/utils/permissions";
import AuthStatus from "@/components/transcript/AuthStatus";

interface User {
  role: UserRole;
}

interface WithAuthProps {
  user: User | null;
}

const withAccess = (
  WrappedComponent: ComponentType<any>,
  requiredPermission: UserRole
) => {
  return (props: WithAuthProps) => {
    const { data: sessionData } = useSession();
    const currentUserRole = sessionData?.user?.permissions as UserRole;

    if (
      currentUserRole &&
      !checkPermissionPrivileges(currentUserRole, requiredPermission)
    ) {
      return (
        <AuthStatus
          title="Unauthorized"
          message="You are not authorized to access this page"
        />
      );
    }
    if (
      !currentUserRole ||
      !checkPermissionPrivileges(currentUserRole, requiredPermission)
    ) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

withAccess.displayName = "withAccess";

export default withAccess;
