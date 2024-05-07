import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import type { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";

type CreatePRProps = Record<string, any> & {
  directoryPath: string;
  fileName: string;
  url: string;
  transcribedText: string;
  prRepo: TranscriptSubmitOptions;
  tags: string[];
  speakers: string[];
};

const createPR = (props: CreatePRProps) => axios.post("/api/github/pr", props);

export function useCreatePR() {
  return useMutation({
    mutationFn: createPR,
  });
}
