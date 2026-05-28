import { useMemo } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TranscriptMetadata, TranscriptionQueueItem } from "../../../../types";

// TODO: move this to a new folder when more endpoints are added
const transcriptionServerAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_TRANSCRIPTION_BASE_URL ?? "",
});

const addToQueue = async ({
  items,
  githubUsername,
}: {
  items: TranscriptMetadata[];
  githubUsername: string;
}) => {
  const jsonString = JSON.stringify(items);
  const file = new File([jsonString], "items_for_transcription.json", {
    type: "application/json",
  });
  const formData = new FormData();
  formData.append("source_file", file);
  // default options
  formData.append("nocheck", String(true));
  formData.append("deepgram", String(true));
  formData.append("diarize", String(true));
  formData.append("github", String(true));
  // record of who initiate the transcription
  formData.append("username", githubUsername);

  const result = await transcriptionServerAxios.post(
    `/transcription/add_to_queue/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return result.data;
};

const removeFromQueue = async (items: TranscriptMetadata[]) => {
  const jsonString = JSON.stringify(items);
  const file = new File([jsonString], "items_for_removal.json", {
    type: "application/json",
  });
  const formData = new FormData();
  formData.append("source_file", file);
  const result = await transcriptionServerAxios.post(
    `/transcription/remove_from_queue/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return result.data;
};

const getQueue = async (): Promise<TranscriptionQueueItem[]> => {
  const result = await transcriptionServerAxios.get("/transcription/queue/");
  return result.data.data;
};

const startTranscription = async () => {
  const result = await transcriptionServerAxios.post("/transcription/start/");
  return result.data;
};

export const useTranscriptionQueue = (
  transcriptionBacklog: TranscriptMetadata[]
) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: userSession } = useSession();

  const queryTranscriptionQueue = useQuery<TranscriptionQueueItem[]>({
    queryFn: getQueue,
    queryKey: ["transcription-queue"],
    refetchInterval: 300000, // Refetch every 5 minute
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const remainingBacklog = useMemo(() => {
    if (!transcriptionBacklog || !queryTranscriptionQueue.data) {
      return [];
    }
    const queueMediaIds = new Set(
      queryTranscriptionQueue.data.map((item) => item.media)
    );
    return transcriptionBacklog.filter(
      (item) => !queueMediaIds.has(item.media)
    );
  }, [transcriptionBacklog, queryTranscriptionQueue.data]);

  const isTranscribing = useMemo(() => {
    if (!queryTranscriptionQueue.data) return false;
    return queryTranscriptionQueue.data.some(
      (item) => item.status === "in_progress"
    );
  }, [queryTranscriptionQueue.data]);

  const mutationAddToQueue = useMutation(addToQueue, {
    onSuccess: () => {
      queryClient.invalidateQueries(["transcription-queue"]);
      toast({
        title: "Source added to transcription queue",
        status: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error with transcription queue",
        description:
          error.response?.data?.detail || "An unknown error occurred.",
        status: "error",
      });
    },
  });

  const mutationRemoveFromQueue = useMutation(removeFromQueue, {
    onSuccess: () => {
      queryClient.invalidateQueries(["transcription-queue"]);
      toast({
        title: "Source removed from transcription queue",
        status: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error with removing from queue",
        description:
          error.response?.data?.detail || "An unknown error occurred.",
        status: "error",
      });
    },
  });

  const addToQueueWithIds = async (ids: string[]) => {
    if (!transcriptionBacklog) return;
    const itemsToAdd = transcriptionBacklog.filter((item) =>
      ids.includes(item.media)
    );
    await mutationAddToQueue.mutateAsync({
      items: itemsToAdd,
      githubUsername: userSession?.user?.githubUsername ?? "",
    });
  };

  const removeFromQueueWithIds = async (ids: string[]) => {
    if (!queryTranscriptionQueue.data) return;
    const itemsToRemove = queryTranscriptionQueue.data.filter((item) =>
      ids.includes(item.media)
    );
    await mutationRemoveFromQueue.mutateAsync(itemsToRemove);
  };

  const mutationStartTranscription = useMutation(startTranscription, {
    onSuccess: () => {
      queryClient.invalidateQueries(["transcription-queue"]);
      toast({
        title: "Transcription process started",
        status: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error starting transcription",
        description:
          error.response?.data?.detail || "An unknown error occurred.",
        status: "error",
      });
    },
  });

  return {
    transcriptionQueue: queryTranscriptionQueue,
    remainingBacklog,
    addToQueue: { ...mutationAddToQueue, mutateAsync: addToQueueWithIds },
    removeFromQueue: {
      ...mutationRemoveFromQueue,
      mutateAsync: removeFromQueueWithIds,
    },
    startTranscription: mutationStartTranscription,
    isTranscribing,
    refetch: queryTranscriptionQueue.refetch,
  };
};
