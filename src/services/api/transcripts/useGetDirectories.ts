import { useQuery } from "@tanstack/react-query";
import type { SelectableMetaDataType } from "../../../../types";
import axios from "axios";

const getMetaData = async (
  path?: string
): Promise<SelectableMetaDataType[]> => {
  return axios
    .get(`/api/github/dir${path ? `?path=${path}` : ""}`)
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetRepoDirectories = (path?: string) =>
  useQuery({
    queryFn: () => getMetaData(path),
    queryKey: ["repoDirectories"],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
