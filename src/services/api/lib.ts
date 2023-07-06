import axios from "./axios";
import endpoints from "./endpoints";

export type CreateUserProp = {
  username: string;
  permissions?: string;
  email: string;
};

type UserData = {
  data: {
    permissions: "reviewer" | "admin";
    id: number;
    email: string;
    githubUsername: string;
    updatedAt: string;
    createdAt: string;
    authToken?: string | null;
    jwt?: string | null;
    archivedAt?: string | null;
  };
};

export const createNewUser = async ({
  username,
  permissions,
  email,
}: CreateUserProp): Promise<UserData> => {
  return axios.post(endpoints.USERS(), {
    username,
    permissions,
    email,
  });
};

// TODO: account for other properties e.g. permissions, jwt, etc.
export const updateUserProfile = async ({
  id,
  email,
  username,
}: CreateUserProp & { id: number }): Promise<UserData> => {
  if (!id) {
    throw new Error("User id is required");
  }
  return axios.put(endpoints.USER_BY_ID(id), {
    email,
    username,
  });
};
