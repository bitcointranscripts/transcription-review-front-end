import axios from "../axios";

import { useQuery } from "@tanstack/react-query";
import endpoints from "../endpoints";

type AdminUsersResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: AdminUsers[];
};

export type AdminUsers = {
  id: number;
  githubUsername: string;
  permissions: string;
  archivedAt: any;
  createdAt: string;
};

export const getAllUsers = async (): Promise<AdminUsers[]> => {
  return axios
    .get(endpoints.GET_USERS_ADMIN())
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetAllUsers = () =>
  useQuery({
    queryFn: () => getAllUsers(),
    queryKey: ["all_users"],
    refetchOnWindowFocus: false,
    enabled: true,
  });

export const updateUserRole = async (id: string): Promise<AdminUsers[]> => {
  return axios
    .get(endpoints.UPDATE_USER_ROLE(id))
    .then((res) => res.data)
    .catch((err) => err);
};

export const useUpdateUserRole = (id: string) =>
  useQuery({
    queryFn: () => updateUserRole(id),
    queryKey: ["all_users"],
    refetchOnWindowFocus: false,
    enabled: true,
  });
