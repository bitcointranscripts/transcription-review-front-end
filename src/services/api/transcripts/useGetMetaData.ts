import { useQuery } from "@tanstack/react-query";
import type { SelectableMetaDataList } from "../../../../types";
import axios from "axios";

const getMetaData = async (): Promise<SelectableMetaDataList> => {
  return axios
    .get("/api/transcriptMeta")
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetMetaData = () =>
  useQuery({
    queryFn: () => getMetaData(),
    queryKey: ["metadataList"],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
