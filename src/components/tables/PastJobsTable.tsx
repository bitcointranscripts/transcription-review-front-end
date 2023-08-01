import { useUserReviews } from "@/services/api/reviews";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import type { ReviewTranscript } from "../../../types";
import BaseTable from "./BaseTable";
import { GroupedLinks, ReviewStatus } from "./TableItems";
import type { TableStructure } from "./types";

const tableStructure = [
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
    name: "date",
    type: "date",
    modifier: (data) => data.content.date,
  },
  {
    name: "category",
    type: "tags",
    modifier: (data) => data.content.categories,
  },
  { name: "tags", type: "tags", modifier: (data) => data.content.tags },
  {
    name: "status",
    type: "action",
    modifier: (data) => data,
    component: (data) => <ReviewStatus data={data} />,
  },
  {
    name: "Links",
    type: "action",
    modifier: (data) => data,
    component: (data) => <GroupedLinks data={data} />,
  },
] satisfies TableStructure<ReviewTranscript>[];

const PastJobsTable = () => {
  const { data: userSession } = useSession();
  const { data, isLoading, isError, refetch } = useUserReviews({
    userId: userSession?.user?.id,
    status: "inactive",
  });
  const tableData = useMemo(() => {
    return (
      (data?.map((item) => {
        const { transcript, ...rest } = item;
        return {
          ...transcript,
          review: {
            ...rest,
          },
        };
      }) as ReviewTranscript[]) ?? []
    );
  }, [data]);

  return (
    <BaseTable
      data={tableData}
      emptyView="No Past Jobs 😭"
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
  );
};

export default PastJobsTable;
