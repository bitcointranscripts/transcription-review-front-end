import axios from "../axios";

import { useMutation, useQuery } from "@tanstack/react-query";
import endpoints from "../endpoints";
import { UpdateUserProp } from "../lib";

export type AdminUsers = {
  id: number;
  githubUsername: string;
  permissions: string;
  archivedAt: any;
  createdAt: string;
};

export const getUsers = async (): Promise<AdminUsers[]> => {
  return axios
    .get(endpoints.GET_USERS_ADMIN())
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetUsers = () =>
  useQuery({
    queryFn: () => getUsers(),
    queryKey: ["users"],
    refetchOnWindowFocus: false,
    enabled: true,
  });

export const updateUserRole = async ({
  id,
  username,
  permissions,
}: Omit<UpdateUserProp, "email">): Promise<AdminUsers[]> => {
  return axios
    .put(endpoints.UPDATE_USER_ROLE(id), {
      permissions,
      username,
    })
    .then((res) => res.data)
    .catch((err) => err);
};

export const useUpdateUserRole = () =>
  useMutation({ mutationFn: updateUserRole });
