import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { TranscriptMetadata, SourceType } from "../../../../types";

// TODO: move this to a new folder when more endpoints are added
const transcriptionServerAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_TRANSCRIPTION_BASE_URL ?? "",
});

const getSources = async (): Promise<SourceType[]> => {
  const result = await transcriptionServerAxios.post(`/curator/get_sources/`, {
    // for now we only care for full coverage sources
    coverage: "full",
  });
  return result.data.data;
};

const getTranscriptionBacklogForSource = async (
  sources: SourceType[]
): Promise<TranscriptMetadata[]> => {
  const jsonString = JSON.stringify(sources);
  const file = new File([jsonString], "sources.json", {
    type: "application/json",
  });
  const formData = new FormData();
  formData.append("source_file", file);

  const result = await transcriptionServerAxios.post(
    "/transcription/preprocess/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return result.data.data;
};

const getTranscriptionBacklog = async (): Promise<TranscriptMetadata[]> => {
  const result = await transcriptionServerAxios.post(
    "curator/get_transcription_backlog/"
  );
  return result.data.data;
};

export const useTranscriptionBacklog = (selectedSource: string) => {
  const { data: sources, isLoading: sourcesIsLoading } = useQuery<SourceType[]>(
    {
      queryFn: getSources,
      queryKey: ["sources"],
      refetchOnWindowFocus: false,
    }
  );

  const filteredSources =
    selectedSource === "all"
      ? sources || []
      : (sources || []).filter((source) => source.loc === selectedSource);

  const queryGetTranscriptionBacklogForSource = useQuery<TranscriptMetadata[]>({
    queryFn: () => getTranscriptionBacklogForSource(filteredSources),
    queryKey: ["transcription-backlog-source", selectedSource],
    refetchOnWindowFocus: false,
    enabled: sources !== undefined,
  });

  const queryGetTranscriptionBacklog = useQuery<TranscriptMetadata[]>({
    queryFn: getTranscriptionBacklog,
    queryKey: ["transcription-backlog"],
    refetchOnWindowFocus: false,
    // we display the transcription backlog (`needs: transcript`)
    // only when "all" is selected
    enabled: selectedSource === "all",
  });

  const transcriptionBacklog =
    selectedSource === "all"
      ? [
          ...(queryGetTranscriptionBacklogForSource.data || []),
          ...(queryGetTranscriptionBacklog.data || []),
        ]
      : queryGetTranscriptionBacklogForSource.data || [];

  const sourcesList = sources
    ? [...sources.map((source) => source.loc), "all"]
    : [];

  const isLoading =
    queryGetTranscriptionBacklogForSource.isLoading ||
    (selectedSource === "all" && queryGetTranscriptionBacklog.isLoading);

  const isError =
    queryGetTranscriptionBacklogForSource.isError ||
    (selectedSource === "all" && queryGetTranscriptionBacklog.isError);

  return {
    transcriptionBacklog: {
      data: transcriptionBacklog,
      isLoading: isLoading,
      isError: isError,
    },
    sources: { data: sourcesList, isLoading: sourcesIsLoading },
  };
};
