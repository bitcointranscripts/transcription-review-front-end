import { useMutation } from "@tanstack/react-query";
import axios from "./axios";
import endpoints from "./endpoints";

const logout = async () => {
  return axios
    .post(endpoints.USER_SIGN_OUT())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const errMessage =
        err?.response?.data?.message || "Please try again later";
      throw new Error(errMessage);
    });
};

export const useLogout = () => useMutation({ mutationFn: logout });
