import { createHash } from "crypto";
import { SaveToGHData } from "../../types";
import config from "@/config/config.json";

export const compareTranscriptBetweenSave = (data: SaveToGHData) => {
  const transcriptAsString = JSON.stringify(data);
  const lastSavedReviewHash = localStorage.getItem(
    config.local_storage_hash_query
  );
  const currentReviewHash = createHash("sha256")
    .update(transcriptAsString)
    .digest("hex");

  if (lastSavedReviewHash === currentReviewHash) {
    return true;
  } else {
    localStorage.setItem(config.local_storage_hash_query, currentReviewHash);
    return false;
  }
};
