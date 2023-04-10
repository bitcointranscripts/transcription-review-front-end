import useTranscripts from "@/hooks/useTranscripts";
import { getCount } from "@/utils";
import { Heading } from "@chakra-ui/react";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";

const tableStructure = [
  { name: "date", type: "date", modifier: (data) => data?.createdAt },
  {
    name: "title",
    type: "text-long",
    modifier: (data) => data.originalContent.title,
  },
  {
    name: "speakers",
    type: "tags",
    modifier: (data) => data.originalContent.speakers,
  },
  {
    name: "category",
    type: "tags",
    modifier: (data) => data.originalContent.categories,
  },
  { name: "tags", type: "tags", modifier: (data) => data.originalContent.tags },
  {
    name: "word count",
    type: "text-short",
    modifier: (data) => `${getCount(data.originalContent.body) ?? "-"} words`,
  },
  { name: "bounty rate", type: "text-short", modifier: () => "N/A" },
  { name: "status", type: "action", modifier: (data) => data.id },
] satisfies TableStructure[];

const PastJobsTable = () => {
  const { transcripts } = useTranscripts();
  const { data, isLoading, isError, refetch } = transcripts;

  return (
    <>
      <BaseTable
        data={data ?? []}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        tableStructure={tableStructure}
        tableHeaderComponent={
          <Heading size="sm" mb={1}>
            Past Jobs
          </Heading>
        }
      />
    </>
  );
};

export default PastJobsTable;
