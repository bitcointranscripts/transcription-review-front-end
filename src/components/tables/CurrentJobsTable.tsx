import { useUserReviews } from "@/services/api/reviews";
import { getCount } from "@/utils";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { Transcript } from "../../../types";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";

const CurrentJobsTable = () => {
  const { data: userSession } = useSession();
  const { data, isLoading, isError, refetch } = useUserReviews({
    userId: userSession?.user?.id,
    isActive: true,
  });

  const router = useRouter();

  const tableData = useMemo(
    () => data?.map((item) => ({ ...item.transcript, reviewId: item.id })),
    [data]
  );

  const handleResume = useCallback(
    (data: Transcript & { reviewId?: number }) => {
      if (!data.reviewId) {
        alert("Error: No reviewId on this review");
        return;
      }
      router.push(`/reviews/${data.reviewId}`);
    },
    [router]
  );

  const tableStructure = useMemo(
    () =>
      [
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
        {
          name: "status",
          actionName: "review",
          type: "action",
          modifier: (data) => data.id,
          action: (data) => handleResume(data),
        },
      ] satisfies TableStructure[],
    [handleResume]
  );

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
            Current Jobs
          </Heading>
        }
      />
    </>
  );
};

export default CurrentJobsTable;
