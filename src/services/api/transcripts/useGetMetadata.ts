import { useQuery } from "@tanstack/react-query";
import type { SelectableMetadataList } from "../../../../types";
import axios from "axios";

const getMetadata = async (): Promise<SelectableMetadataList> => {
  return axios
    .get("/api/transcriptMeta")
    .then((res) => res.data)
    .catch((err) => err);
};

export const useGetMetadata = () =>
  useQuery({
    queryFn: () => getMetadata(),
    queryKey: ["metadataList"],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
