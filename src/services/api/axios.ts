import axios from "axios";
import { signIn, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_QUEUE_BASE_URL ?? "",
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.jwt) {
    config.headers.Authorization = `Bearer ${session.user.jwt}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  async (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    const statusCode = error.response.status;
    if (statusCode === 401) {
      await signOut({ redirect: false });
      await signIn("github");
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosInstance;
