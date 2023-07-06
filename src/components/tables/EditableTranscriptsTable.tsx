import { useUserReviews } from "@/services/api/reviews";
import { useClaimTranscript, useTranscripts } from "@/services/api/transcripts";
import { calculateReadingTime, wordsFormat } from "@/utils";
import { Box, Heading, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Transcript } from "../../../types";
import BaseTable from "./BaseTable";
import { TableStructure } from "./types";

const EmptyText = ({
  hasActiveTranscript,
  hasMorePendingTranscript,
}: {
  hasMorePendingTranscript: boolean;
  hasActiveTranscript: boolean;
}) => {
  const props =
    hasMorePendingTranscript || hasActiveTranscript
      ? {
          color: "black",
          fontWeight: "bold",
        }
      : undefined;
  const text = useMemo(() => {
    if (hasActiveTranscript)
      return "Please finish editing & submit the transcript you're working on before choosing a new one";
    if (hasMorePendingTranscript)
      return "You can only have 3 transcripts under review at once. Please wait until at least one is approved";

    return "There are no transcripts that you can edit";
  }, [hasActiveTranscript, hasMorePendingTranscript]);

  return <Text {...props}>{text}</Text>;
};

const activeLimit = 1;
const pendingLimit = 3;

const EditableTranscriptsTable = () => {
  const { data: session, status } = useSession();
  const { data: activeReviews = [] } = useUserReviews({
    userId: session?.user?.id,
    status: "active",
  });
  const { data: pendingReviews = [] } = useUserReviews({
    userId: session?.user?.id,
    status: "pending",
  });

  const router = useRouter();
  const claimTranscript = useClaimTranscript();
  const { data, isLoading, isError, refetch } = useTranscripts();
  const toast = useToast();
  const hasActiveTranscript = activeReviews.length >= activeLimit;
  const hasMorePendingTranscript = pendingReviews.length >= pendingLimit;
  const editableData = useMemo(() => {
    if (hasActiveTranscript || hasMorePendingTranscript) return [];

    return data;
  }, [data, hasActiveTranscript, hasMorePendingTranscript]);

  const retriedClaim = useRef(0);

  const [claimState, setClaimState] = useState({
    rowId: -1,
  });

  const retryLoginAndClaim = async (transcriptId: number) => {
    await signOut({ redirect: false });
    if (retriedClaim.current < 2) {
      retriedClaim.current += 1;
      await signIn("github", {
        callbackUrl: `/?reclaim=true&txId=${transcriptId}`,
      });
    }
  };

  const handleClaim = useCallback(
    async (transcriptId: number) => {
      if (status === "loading") {
        toast({
          status: "loading",
          title: "loading fun",
          description: "loading up some fun for you... please wait.",
        });
        return;
      } else if (status === "unauthenticated") {
        // Sign-in user before trying to claim a transcript
        await signIn("github", {
          callbackUrl: `/?reclaim=true&txId=${transcriptId}`,
        });
        return;
      }
      if (session?.user?.id) {
        setClaimState((prev) => ({ ...prev, rowId: transcriptId }));
        // Fork repo
        axios.post("/api/github/fork");

        // Claim transcript
        claimTranscript.mutate(
          { userId: session.user.id, transcriptId },
          {
            onSuccess: async (data) => {
              setClaimState((prev) => ({ ...prev, rowId: -1 }));
              if (data instanceof Error) {
                await retryLoginAndClaim(transcriptId);
                return;
              }
              router.push(`/reviews/${data.id}`);
            },

            onError: (err) => {
              const error = err as Error;
              setClaimState((prev) => ({ ...prev, rowId: -1 }));
              toast({
                status: "error",
                title: "Failed to claim transcript",
                description: error?.message,
              });
            },
          }
        );
      } else {
        await retryLoginAndClaim(transcriptId);
      }
    },
    [status, session?.user?.id, claimTranscript, router, toast]
  );

  useEffect(() => {
    const { reclaim, txId } = router.query;
    if (
      reclaim &&
      txId &&
      data &&
      status === "authenticated" &&
      retriedClaim.current < 2
    ) {
      retriedClaim.current = 2;
      handleClaim(Number(txId));
    }
  }, [data, router, handleClaim, status]);

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
        {
          name: "tags",
          type: "tags",
          modifier: (data) => data.content.tags,
        },
        {
          name: "word count",
          type: "text-short",
          modifier: (data) => (
            <Box>
              <Text>
                {Number(data.contentTotalWords)
                  ? `${wordsFormat.format(data.contentTotalWords)} words`
                  : "N/A"}
              </Text>
              <Text fontWeight="bold">
                {`Approx. editing time = ${calculateReadingTime(
                  Number(data.contentTotalWords)
                )}`}
              </Text>
            </Box>
          ),
        },
        {
          name: "Up for grabs",
          actionName: "claim",
          type: "action",
          modifier: (data) => data.id,
          action: (data: Transcript) => handleClaim(data.id),
        },
      ] as TableStructure[],
    [handleClaim]
  );

  return (
    <BaseTable
      actionState={claimState}
      data={editableData}
      emptyView={
        <EmptyText
          hasActiveTranscript={hasActiveTranscript}
          hasMorePendingTranscript={hasMorePendingTranscript}
        />
      }
      isError={isError}
      isLoading={isLoading}
      refetch={refetch}
      tableStructure={tableStructure}
      tableHeaderComponent={
        <Heading size="sm" mb={1}>
          Transcripts you can edit
        </Heading>
      }
    />
  );
};

export default EditableTranscriptsTable;
