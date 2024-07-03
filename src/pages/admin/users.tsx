import { Flex, Heading } from "@chakra-ui/react";
import { useGetUsers } from "@/services/api/admin/useUsers";
import UsersTable from "@/components/tables/UsersTable";
import { useHasPermission } from "@/hooks/useHasPermissions";
import AuthStatus from "@/components/transcript/AuthStatus";

const Users = () => {
  const { data: usersResponse, isLoading, isError, refetch } = useGetUsers();
  const canAccessUser = useHasPermission("accessUsers");

  const sortedData = usersResponse?.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  });

  if (!canAccessUser) {
    return (
      <AuthStatus
        title="Unauthorized"
        message="You are not authorized to access this page"
      />
    );
  }
  return (
    <>
      <Flex flexDir="column">
        <Heading size={"md"} mb={10}>
          Users
        </Heading>
        <UsersTable
          users={sortedData ?? []}
          isError={isError}
          isLoading={isLoading}
          hasFilters={false}
          totalPages={1}
          refetch={refetch}
        />
      </Flex>
    </>
  );
};

export default Users;
