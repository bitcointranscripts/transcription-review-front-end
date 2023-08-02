/* eslint-disable @next/next/no-img-element */
import { useUserReviews } from "@/services/api/reviews";
import {
  calculateReadingTime,
  convertStringToArray,
  displaySatCoinImage,
} from "@/utils";
import { Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { ReviewTranscript } from "../../../types";
import BaseTable from "./BaseTable";
import TitleWithTags from "./TitleWithTags";
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
    let _activeData = activeReviews?.data ?? [];
    let _pendingData = pendingReviews?.data ?? [];
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
      const pendingIndex = pendingReviews?.data?.findIndex(
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
          name: "Duration",
          type: "text-short",
          modifier: (data) => (
            <Text>
              {`${calculateReadingTime(Number(data.contentTotalWords))}`}
            </Text>
          ),
        },
        {
          name: "Sats",
          type: "text-short",
          modifier: (data) => (
            <img
              alt={`${data.contentTotalWords} sat coins`}
              src={displaySatCoinImage(data.contentTotalWords)}
            />
          ),
        },
        {
          name: "status",
          type: "action",
          modifier: (data) => data.id,
          component: (data) => <ActionComponent data={data} />,
        },
      ] satisfies TableStructure<ReviewTranscript>[],
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
      <Link href="/transcripts">
        <Button size="xs" colorScheme="orange">
          Choose transcript to edit
        </Button>
      </Link>
    </Flex>
  );
};
