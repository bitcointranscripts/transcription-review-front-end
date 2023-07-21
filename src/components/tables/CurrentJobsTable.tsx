import { useUserReviews } from "@/services/api/reviews";
import { calculateReadingTime } from "@/utils";
import { Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { ReviewTranscript } from "../../../types";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";

const CurrentJobsTable = () => {
  const { data: userSession } = useSession();
  const {
    data: activeReviews,
    isLoading,
    isError,
    refetch,
  } = useUserReviews({
    userId: userSession?.user?.id,
    status: "active",
  });
  const { data: pendingReviews } = useUserReviews({
    userId: userSession?.user?.id,
    status: "pending",
  });

  const router = useRouter();

  const tableData = useMemo(() => {
    let _activeData = activeReviews ?? [];
    let _pendingData = pendingReviews ?? [];
    let cummulativeCurrentJobs = _activeData.concat(_pendingData);
    if (!cummulativeCurrentJobs.length) return [];

    // return data restructured as ReviewTranscript[]
    return cummulativeCurrentJobs.map((item) => {
      const { transcript, ...rest } = item;
      return {
        ...transcript,
        review: {
          ...rest,
        },
      };
    }) as ReviewTranscript[];
  }, [activeReviews, pendingReviews]);

  const ActionComponent = useCallback(
    ({ data }: { data: ReviewTranscript }) => {
      const pendingIndex = pendingReviews?.findIndex(
        (review) => review.id === data.review?.id
      );
      const isPending = pendingIndex !== -1;

      const handleResume = () => {
        if (!data.review?.id) {
          alert("Error: No reviewId on this review");
          return;
        }
        router.push(`/reviews/${data.review?.id}`);
      };
      return (
        <>
          {isPending ? (
            <Link href={`${data.review?.pr_url}`} target="_blank">
              <Button colorScheme={"gray"} size="sm">
                Under Review
              </Button>
            </Link>
          ) : (
            <Button colorScheme={"orange"} size="sm" onClick={handleResume}>
              Continue editing transcript
            </Button>
          )}
        </>
      );
    },
    [pendingReviews, router]
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
          name: "time to edit",
          type: "text-short",
          modifier: (data) => (
            <Text>
              {`~${calculateReadingTime(Number(data.contentTotalWords))}`}
            </Text>
          ),
        },
        {
          name: "status",
          type: "action",
          modifier: (data) => data.id,
          component: (data) => <ActionComponent data={data} />,
        },
      ] satisfies TableStructure[],
    [ActionComponent]
  );

  return (
    <BaseTable
      data={tableData}
      emptyView={<EmptyView />}
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
  );
};

export default CurrentJobsTable;

const EmptyView = () => {
  return (
    <Flex w="full" justifyContent="center" alignItems="center" gap={2}>
      <Text>No Current Jobs 😭</Text>
      <Link href="/">
        <Button size="xs" colorScheme="orange">
          Choose transcript to edit
        </Button>
      </Link>
    </Flex>
  );
};
