import { useUserReviews } from "@/services/api/reviews";
import { getCount } from "@/utils";
import { Button, Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { ReviewTranscript, UserReview } from "../../../types";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";

const CurrentJobsTable = () => {
  const { data: userSession } = useSession();
  const { data, isLoading, isError, refetch } = useUserReviews({
    userId: userSession?.user?.id,
    status: "active",
  });
  const {
    data: pendingTranscripts,
    isLoading: isLoadingPending,
    refetch: refetchPending,
  } = useUserReviews({
    userId: userSession?.user?.id,
    status: "pending",
  });

  const router = useRouter();

  const tableData = useMemo(() => {
    let _activeData = data ?? [];
    let _pendingData = pendingTranscripts ?? [];
    let cummulativeCurrentJobs = _activeData.concat(_pendingData);
    if (!cummulativeCurrentJobs.length) return [];
    return cummulativeCurrentJobs.map((item) => ({
      ...item.transcript,
      reviewId: item.id,
    }));
  }, [data, pendingTranscripts]);

  const handleResume = useCallback(
    (data: ReviewTranscript) => {
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
          component: (data) => <ActionComponent data={data} />,
        },
      ] satisfies TableStructure[],
    [handleResume]
  );

  const ActionComponent = ({ data }: { data: ReviewTranscript }) => {
    return (
      <Button
        // isDisabled={tableItem.isDisabled}
        colorScheme="orange"
        size="sm"
        onClick={() => handleResume(data)}
      >
        Review
      </Button>
    );
  };

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
