import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const transcriptionServerAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_TRANSCRIPTION_BASE_URL ?? "",
  timeout: 10000,
});

const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

const fetchYoutubeVideoUrl = async (youtubeUrl: string): Promise<string> => {
  const response = await transcriptionServerAxios.post(
    "/media/youtube-video-url",
    { youtube_url: youtubeUrl }
  );
  return response.data.video_url;
};

export const useYoutubeVideoUrl = (mediaUrl: string | undefined) => {
  const isYoutube = !!mediaUrl && youtubeRegex.test(mediaUrl);

  return useQuery<string, Error>({
    queryKey: ["youtube-video-url", mediaUrl],
    queryFn: () => fetchYoutubeVideoUrl(mediaUrl!),
    enabled: isYoutube,
    retry: 5,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};
