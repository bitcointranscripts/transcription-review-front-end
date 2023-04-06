import useTranscripts from "@/hooks/useTranscripts";
import { getCount } from "@/utils";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Transcript } from "../../../types";
import BaseTable from "./BaseTable";
import { TableStructure } from "./types";

const QueueTable = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { transcripts, claimTranscript } = useTranscripts();
  const { data, isLoading, isError, refetch } = transcripts;

  const retriedClaim = useRef(0);
  const auth_url = useRef(process.env.NEXT_PUBLIC_AUTH_URL);

  const [claimState, setClaimState] = useState({
    rowId: -1,
  });

  // console.log({session})
  useEffect(() => {
    if (!auth_url.current) {
      auth_url.current = process.env.NEXT_PUBLIC_AUTH_URL;
    }
  }, []);

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
        alert("Authenticating.... please wait.");
        return;
      } else if (status === "unauthenticated") {
        alert("You have to login to claim a transcript");
        return;
      }
      if (session?.user?.id) {
        setClaimState((prev) => ({ ...prev, rowId: transcriptId }));
        claimTranscript.mutate(
          { userId: session.user.id, transcriptId },
          {
            onSuccess: async (data) => {
              setClaimState((prev) => ({ ...prev, rowId: -1 }));
              if (data instanceof Error) {
                await retryLoginAndClaim(transcriptId);
                return;
              }
              router.push(`/transcripts/${transcriptId}`);
            },

            onError: (err) => {
              setClaimState((prev) => ({ ...prev, rowId: -1 }));
              alert("failed to claim: " + err);
            },
          }
        );
      } else {
        await retryLoginAndClaim(transcriptId);
      }
    },
    [session, status, claimTranscript, router]
  );

  // Reclaim transcript when there's a reclaimquery
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
        { name: "date", type: "date", modifier: (data) => data?.createdAt },
        {
          name: "title",
          type: "text-long",
          modifier: (data) => data.originalContent.title,
        },
        {
          name: "speakers",
          type: "tags",
          modifier: (data) => data.originalContent.speakers,
        },
        {
          name: "category",
          type: "tags",
          modifier: (data) => data.originalContent.categories,
        },
        {
          name: "tags",
          type: "tags",
          modifier: (data) => data.originalContent.tags,
        },
        {
          name: "word count",
          type: "text-short",
          modifier: (data) =>
            `${getCount(data.originalContent.body) ?? "-"} words`,
        },
        // { name: "bounty rate", type: "text-short", modifier: (data) => "N/A" },
        {
          name: "",
          type: "action",
          modifier: (data) => data.id,
          action: (data: Transcript) => handleClaim(data.id),
        },
      ] as TableStructure[],
    [handleClaim]
  );

  return (
    <>
      <BaseTable
        data={data ?? []}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        actionState={claimState}
        tableStructure={tableStructure}
      />
    </>
  );
};

export default QueueTable;
