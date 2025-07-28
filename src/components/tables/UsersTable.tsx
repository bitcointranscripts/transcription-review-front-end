import { Flex, Text, Tooltip, useToast } from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";

import { useState } from "react";
import { format } from "date-fns";
import { AdminUsers, useUpdateUserRole } from "@/services/api/admin/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { UpdateRole } from "./TableItems";
import { UserRole } from "../../../types";

const tableStructure = [
  {
    name: "id",
    type: "text-short",
    modifier: (data) => data.id,
  },
  {
    name: "username",
    type: "text-short",
    modifier: (data) => data.githubUsername,
  },
  {
    name: "Role",
    type: "text-short",
    modifier: (data) => data.permissions,
  },
  {
    name: "Joined",
    type: "action",
    modifier: (data) => data.createdAt,
    component: (data) => (
      <Tooltip
        label={`${format(
          new Date(data.createdAt),
          "MMM d, yyyy, 	h:mm aa OO "
        )}`}
        cursor={"pointer"}
      >
        <Text cursor={"pointer"}>
          {format(new Date(data.createdAt), "yyyy-MM-dd")}
        </Text>
      </Tooltip>
    ),
  },
] satisfies TableStructure<AdminUsers>[];

const EmptyView = ({ hasFilters }: { hasFilters: boolean }) => {
  return (
    <Flex w="full" justifyContent="center" alignItems="center" gap={2}>
      <Text>
        {hasFilters ? "No user found for the set criteria" : "No user found"}
      </Text>
    </Flex>
  );
};

type Props = {
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  users: AdminUsers[] | undefined;
  totalPages: number | undefined;
  refetch: () => void;
};

const UsersTable = ({ isLoading, isError, hasFilters, users }: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toast = useToast();
  const { data: userSession } = useSession();
  const queryClient = useQueryClient();
  const updateUser = useUpdateUserRole();

  const handleUpdate = async (role: UserRole) => {
    const ids = selectedIds.map(Number);

    if (userSession?.user?.id) {
      try {
        await Promise.all(
          ids.map((userId) =>
            updateUser.mutateAsync({ id: userId, permissions: role })
          )
        );
        queryClient.invalidateQueries(["users"]);
        setSelectedIds([]);
        toast({
          status: "success",
          title: "Updated Roles Successfully",
        });
      } catch (err) {
        const error = err as Error;
        toast({
          status: "error",
          title: "Error while updating roles",
          description: error?.message,
        });
      }
    } else {
      await signOut({ redirect: false });
      signIn("github");
    }
  };

  return (
    <>
      <BaseTable
        data={users}
        emptyView={<EmptyView hasFilters={hasFilters} />}
        isLoading={isLoading}
        isError={isError}
        tableStructure={tableStructure}
        enableCheckboxes
        selectedRowIds={selectedIds}
        onSelectedRowIdsChange={setSelectedIds}
        getRowId={(row) => `${row.id}`}
        actionItems={
          <>
            {selectedIds.length > 0 && (
              <UpdateRole
                isLoading={updateUser.isLoading}
                handleRequest={handleUpdate}
              />
            )}
          </>
        }
      />
    </>
  );
};

export default UsersTable;
