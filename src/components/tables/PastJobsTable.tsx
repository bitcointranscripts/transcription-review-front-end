import { useUserReviews } from "@/services/api/reviews";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import type { ReviewTranscript } from "../../../types";
import BaseTable from "./BaseTable";
import Pagination from "./Pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = useUserReviews({
    userId: userSession?.user?.id,
    status: "inactive",
    page: currentPage,
  });
  const tableData = useMemo(() => {
    return (
      (data?.data?.map((item) => {
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
    <>
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
      <Pagination
        pages={data?.totalPages || 0}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};

export default PastJobsTable;
