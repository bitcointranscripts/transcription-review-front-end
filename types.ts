export type Transcript = {
  id: number;
  archivedAt: Nullable<Date>;
  archivedBy: Nullable<number>;
  createdAt: Nullable<Date>;
  content: TranscriptContent;
  status?: "queued" | "not queued" | "requeued";
  updatedAt: Nullable<Date>;
  originalContent: TranscriptContent;
  transcriptHash: string;
};

export type Review = {
  id: number;
  userId: number;
  transcriptId: number;
  updatedAt: Nullable<Date>;
  createdAt: Date;
  claimedAt: Nullable<Date>;
  submittedAt: Nullable<Date>;
  mergedAt: Nullable<Date>;
};

export type UserReview = Review & {
  transcript: Transcript;
};

export type TranscriptContent = {
  body: string;
  categories: string[];
  date: Nullable<Date>;
  media: Nullable<string>;
  speakers: string[];
  tags: string[];
  title: string;
  transcript_by: Nullable<string>;
  loc?: string;
};

type Nullable<T> = T | null;

export type MetadataProps = {
  fileTitle: string;
  transcript_by: string;
  url: string;
  date: string;
  tags?: string[];
  speakers?: string[];
  categories?: string[];
};
