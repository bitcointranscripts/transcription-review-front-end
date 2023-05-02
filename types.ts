export type Transcript = {
  id: number;
  archivedAt: Nullable<Date>;
  archivedBy: Nullable<number>;
  createdAt: Nullable<Date>;
  content: TranscriptContent;
  status?: string;
  updatedAt: Nullable<Date>;
  originalContent: TranscriptContent;
  // userId:     Nullable<number>;
  // reviewedAt: Nullable<Date>;
  // claimedBy:  Nullable<number>;
};

type TranscriptContent = {
  body: string;
  categories: string[];
  date: Date;
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
