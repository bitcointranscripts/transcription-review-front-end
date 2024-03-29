import { useUserReviews } from "@/services/api/reviews";
import { convertStringToArray } from "@/utils";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import type { ReviewTranscript } from "../../../types";
import BaseTable from "./BaseTable";
import Pagination from "./Pagination";
import { GroupedLinks, ReviewStatus } from "./TableItems";
import TitleWithTags from "./TitleWithTags";
import type { TableStructure } from "./types";

const tableStructure = [
  {
    name: "Title",
    type: "default",
    component: (data) => {
      const allTags = convertStringToArray(data.content.tags);
      return (
        <TitleWithTags
          title={data.content.title}
          allTags={allTags}
          categories={data.content.categories}
          id={data.id}
          length={allTags.length}
        />
      );
    },
    modifier: () => null,
  },
  {
    name: "speakers",
    type: "tags",
    modifier: (data) => data.content.speakers,
  },
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
  const [totalPages, setTotalPages] = useState<number>(data?.totalPages || 0);

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

  useEffect(() => {
    if (data) {
      setTotalPages(data?.totalPages || 0);
    }
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
        pages={totalPages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
};

export default PastJobsTable;
