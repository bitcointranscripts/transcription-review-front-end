import { Flex, Select, Td, Text, Tooltip } from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";

import { ChangeEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { AdminUsers } from "@/services/api/admin/useUsers";
import { updateUserRole } from "@/services/api/lib";
import { UserRole } from "../../../types";
import { UserRoles } from "@/config/default";
import { useQueryClient } from "@tanstack/react-query";

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

const AllUsersTable = ({ isLoading, isError, hasFilters, users }: Props) => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const onSelectRoles = async (
    e: ChangeEvent<HTMLSelectElement>,
    data: { id: number; username: string; permissions: UserRole }
  ) => {
    setIsUpdating(true);
    try {
      updateUserRole({
        id: data.id,
        username: data.username,
        permissions: e.target.value as UserRole,
      });
      await queryClient.invalidateQueries(["all_users"]);
    } catch {
      return "Something went wrong";
    } finally {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    queryClient.invalidateQueries(["all_users"]);
  }, [isUpdating, queryClient]);

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
      name: "Role Permissions",
      type: "text-short",
      modifier: (data) => data.permissions,
    },
    {
      name: "Joined",
      type: "default",
      modifier: (data) => data.createdAt,
      component: (data) => (
        <Td>
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
        </Td>
      ),
    },
    {
      name: "Select Role",
      type: "default",
      modifier: (data) => data.createdAt,
      component: (data) => (
        <Td>
          <Select
            onChange={(e) =>
              onSelectRoles(e, {
                id: data.id,
                username: data.githubUsername,
                permissions: e.target.value as UserRole,
              })
            }
            defaultValue={data.permissions}
          >
            {Object.values(UserRoles).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Td>
      ),
    },
  ] satisfies TableStructure<AdminUsers>[];
  return (
    <BaseTable
      data={users}
      emptyView={<EmptyView hasFilters={hasFilters} />}
      isLoading={isLoading}
      isError={isError}
      tableStructure={tableStructure}
      showAdminControls
    />
  );
};

export default AllUsersTable;
