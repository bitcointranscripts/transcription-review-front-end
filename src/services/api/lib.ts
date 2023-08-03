import { UserData, UserRole } from "../../../types";
import axios from "./axios";
import endpoints from "./endpoints";

export type UpdateUserProp = {
  id: number;
  username?: string;
  permissions?: UserRole;
  email: string;
};

type AuthToken = {
  jwt: string;
};

export const signInUser = async ({
  github_access_token,
  email,
}: {
  github_access_token: string;
  email: string;
}): Promise<AuthToken> => {
  return axios
    .post(
      endpoints.USER_SIGN_IN(),
      {
        email,
      },
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
export const updateUserProfile = async (
  { id, email, username }: UpdateUserProp,
  options?: { jwt: string }
): Promise<{ data: UserData }> => {
  if (!id) {
    throw new Error("User id is required");
  }
  if (options?.jwt) {
    return axios.put(
      endpoints.USER_BY_ID(id),
      {
        email,
        username,
      },
      {
        headers: {
          Authorization: `Bearer ${options.jwt}`,
        },
      }
    );
  }
  return axios.put(endpoints.USER_BY_ID(id), {
    email,
    username,
  });
};
