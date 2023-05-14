import { useUserReviews } from "@/services/api/reviews";
import { getCount } from "@/utils";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";

const tableStructure = [
  { name: "date", type: "date", modifier: (data) => data?.createdAt },
  {
    name: "title",
    type: "text-long",
    modifier: (data) => data.content.title,
  },
  {
    name: "speakers",
    type: "tags",
    modifier: (data) => data.content.speakers,
  },
  {
    name: "category",
    type: "tags",
    modifier: (data) => data.content.categories,
  },
  { name: "tags", type: "tags", modifier: (data) => data.content.tags },
  {
    name: "word count",
    type: "text-short",
    modifier: (data) => `${getCount(data.content.body) ?? "-"} words`,
  },
] satisfies TableStructure[];

const PastJobsTable = () => {
  const { data: userSession } = useSession();
  const { data, isLoading, isError, refetch } = useUserReviews({
    userId: userSession?.user?.id,
    isActive: false,
  });
  const tableData = useMemo(() => data?.map((item) => item.transcript), [data]);

  return (
    <>
      <BaseTable
        data={tableData}
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
