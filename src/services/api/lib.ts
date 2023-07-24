import { UserData, UserRole } from "../../../types";
import axios from "./axios";
import endpoints from "./endpoints";

export type CreateUserProp = {
  username: string;
  permissions: UserRole;
  email: string;
};

type AuthToken = {
  jwt: string;
};

export const createNewUser = async ({
  username,
  permissions,
  email,
}: CreateUserProp): Promise<{ data: UserData }> => {
  return axios.post(endpoints.USERS(), {
    username,
    permissions,
    email,
  });
};

export const signUpNewUser = async ({
  username,
  permissions,
  email,
}: CreateUserProp): Promise<AuthToken & UserData> => {
  return axios
    .post(endpoints.USER_SIGN_UP(), {
      username,
      permissions,
      email,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
export const signInUser = async ({
  github_access_token,
}: {
  github_access_token: string;
}): Promise<AuthToken> => {
  return axios
    .post(
      endpoints.USER_SIGN_IN(),
      {},
      {
        headers: {
          "x-github-token": github_access_token,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

// TODO: account for other properties e.g. permissions, jwt, etc.
export const updateUserProfile = async ({
  id,
  email,
  username,
}: CreateUserProp & { id: number }): Promise<{ data: UserData }> => {
  if (!id) {
    throw new Error("User id is required");
  }
  return axios.put(endpoints.USER_BY_ID(id), {
    email,
    username,
  });
};
