import { Flex, Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import AuthStatus from "@/components/transcript/AuthStatus";
import { useGetAllUsers } from "@/services/api/admin/useUsers";
import AllUsersTable from "@/components/tables/AllUsersTable";

const AllUsers = () => {
  const { data: sessionData } = useSession();

  const isAdmin = sessionData?.user?.permissions === "admin";

  const { data: usersResponse, isLoading, isError, refetch } = useGetAllUsers();

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
          All Users
        </Heading>
        <Flex
          gap={6}
          wrap="wrap"
          justifyContent="space-between"
          alignItems={"center"}
        >
          {/* <Flex gap={4} alignItems={"center"}>
            {refetch && <RefetchButton refetch={refetch} />}
            {showReset && (
              <Button
                onClick={resetFilters}
                size={"xs"}
                colorScheme={"red"}
                variant={"outline"}
              >
                Reset
              </Button>
            )}
            <Text fontWeight="bold" fontSize="14px" color="gray.500">
              Results: {totalReviews ?? 0}
            </Text>
          </Flex> */}
        </Flex>
        <AllUsersTable
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

export default AllUsers;
