import { Flex, Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import AuthStatus from "@/components/transcript/AuthStatus";
import { useGetUsers } from "@/services/api/admin/useUsers";
import UsersTable from "@/components/tables/UsersTable";

const Users = () => {
  const { data: sessionData } = useSession();

  const isAdmin = sessionData?.user?.permissions === "admin";

  const { data: usersResponse, isLoading, isError, refetch } = useGetUsers();

  const sortedData = usersResponse?.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  });

  if (!isAdmin) {
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
