import { useUserMultipleReviews } from "@/services/api/reviews";
import {
  calculateReadingTime,
  convertStringToArray,
  displaySatCoinImage,
} from "@/utils";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { ReviewTranscript } from "../../../types";
import BaseTable from "./BaseTable";
import TitleWithTags from "./TitleWithTags";
import type { TableStructure } from "./types";
import Image from "next/image";

const CurrentJobsTable = () => {
  const router = useRouter();
  const { data: userSession } = useSession();

  const {
    data: multipleStatusData,
    isLoading,
    refetch,
    isError,
  } = useUserMultipleReviews({
    userId: userSession?.user?.id,
    multipleStatus: ["pending", "active"],
  });

  const tableData = useMemo(() => {
    if (!multipleStatusData.length) return [];

    // return data restructured as ReviewTranscript[]
    return multipleStatusData.map((item) => {
      const { transcript, ...rest } = item;
      return {
        ...transcript,
        review: {
          ...rest,
        },
      };
    }) as ReviewTranscript[];
  }, [multipleStatusData]);

  const hasActiveReview = tableData.find(
    (data) => data.review?.submittedAt === null
  );

  const ActionComponent = useCallback(
    ({ data }: { data: ReviewTranscript }) => {
      const pendingReview = data.review?.pr_url;

      const handleResume = () => {
        if (!data.review?.id) {
          alert("Error: No reviewId on this review");
          return;
        }
        router.push(`/reviews/${data.review?.id}`);
      };
      return (
        <>
          {Boolean(pendingReview) ? (
            <Flex gap={4}>
              <Link href={`${data.review?.pr_url}`} target="_blank">
                <Button colorScheme={"gray"} size="sm">
                  Under Review
                </Button>
              </Link>
              {!data.review?.mergedAt && (
                <Button onClick={handleResume} colorScheme={"orange"} size="sm">
                  Resubmit
                </Button>
              )}
            </Flex>
          ) : (
            <Button colorScheme={"orange"} size="sm" onClick={handleResume}>
              Continue editing transcript
            </Button>
          )}
        </>
      );
    },
    [router]
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
          name: "Time To Edit",
          type: "text-short",
          modifier: (data) => (
            <Text>
              {`~${calculateReadingTime(Number(data.contentTotalWords))}`}
            </Text>
          ),
        },
        {
          name: "Sats",
          type: "text-short",
          modifier: (data) => (
            <Box
              position="relative"
              className="responsive-image"
              width={"100%"}
              minWidth={"26px"}
              minHeight={"42px"}
              height="100%"
            >
              <Image
                alt={`${data.contentTotalWords} sat coins`}
                src={displaySatCoinImage(data.contentTotalWords)}
                objectFit="contain"
                fill
              />
            </Box>
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
    <>
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
      {!hasActiveReview && tableData.length && (
        <Flex justifyContent="center">
          <NextLink href="/transcripts">
            <Button size="xs" colorScheme="orange">
              Choose transcript to edit
            </Button>
          </NextLink>
        </Flex>
      )}
    </>
  );
};

export default CurrentJobsTable;

const EmptyView = () => {
  return (
    <Flex w="full" justifyContent="center" alignItems="center" gap={2}>
      <Text>No Current Jobs 😭</Text>
      <NextLink href="/transcripts">
        <Button size="xs" colorScheme="orange">
          Choose transcript to edit
        </Button>
      </NextLink>
    </Flex>
  );
};
