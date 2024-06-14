import { Flex, Heading } from "@chakra-ui/react";
import { useGetUsers } from "@/services/api/admin/useUsers";
import UsersTable from "@/components/tables/UsersTable";
import withAccess from "@/hoc/withAccess";

const Users = () => {
  const { data: usersResponse, isLoading, isError, refetch } = useGetUsers();

  const sortedData = usersResponse?.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  });

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

export default withAccess(Users, "admin");
