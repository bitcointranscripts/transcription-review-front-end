/* eslint-disable no-unused-vars */

import {
  useArchiveTranscript,
  useClaimTranscript,
  useTranscripts,
} from "@/services/api/transcripts";
import { getCount } from "@/utils";
import { CheckboxGroup, useToast } from "@chakra-ui/react";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Transcript } from "../../../types";
import BaseTable from "./BaseTable";
import { TableStructure } from "./types";

type AdminArchiveSelectProps = {
  children: (props: {
    handleArchive: () => Promise<void>;
    hasAdminSelected: boolean;
    isArchiving: boolean;
  }) => React.ReactNode;
};

const AdminArchiveSelect = ({ children }: AdminArchiveSelectProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toast = useToast();
  const { data: userSession } = useSession();
  const queryClient = useQueryClient();
  const archiveTranscript = useArchiveTranscript();

  const handleCheckboxToggle = (values: (string | number)[]) => {
    setSelectedIds(values.map(String));
  };
  const handleArchive = async () => {
    const ids = selectedIds.map(Number);

    if (userSession?.user?.id) {
      const archivedBy = userSession?.user.id;
      try {
        await Promise.all(
          ids.map((transcriptId) =>
            archiveTranscript.mutateAsync({
              transcriptId,
              archivedBy,
            })
          )
        );

        queryClient.invalidateQueries(["transcripts"]);
        setSelectedIds([]);
        toast({
          status: "success",
          title: "Archived successfully",
        });
      } catch (err) {
        const error = err as Error;
        toast({
          status: "error",
          title: "Error while archiving transcript",
          description: error?.message,
        });
      }
    } else {
      await signOut({ redirect: false });
      signIn("github");
    }
  };

  return (
    <CheckboxGroup colorScheme="orange" onChange={handleCheckboxToggle}>
      {children({
        handleArchive,
        hasAdminSelected: selectedIds.length > 0,
        isArchiving: archiveTranscript.isLoading,
      })}
    </CheckboxGroup>
  );
};

const QueueTable = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const claimTranscript = useClaimTranscript();
  const { data, isLoading, isError, refetch } = useTranscripts();

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
        alert("Authenticating.... please wait.");
        return;
      } else if (status === "unauthenticated") {
        alert("You have to login to claim a transcript");
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
        {
          name: "tags",
          type: "tags",
          modifier: (data) => data.content.tags,
        },
        {
          name: "word count",
          type: "text-short",
          modifier: (data) => `${getCount(data.content.body) ?? "-"} words`,
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
      <AdminArchiveSelect>
        {({ handleArchive, hasAdminSelected, isArchiving }) => (
          <BaseTable
            actionState={claimState}
            data={data}
            handleArchive={handleArchive}
            hasAdminSelected={hasAdminSelected}
            isError={isError}
            isArchiving={isArchiving}
            isLoading={isLoading}
            refetch={refetch}
            showAdminControls
            tableHeader="Transcripts waiting for review..."
            tableStructure={tableStructure}
          />
        )}
      </AdminArchiveSelect>
    </>
  );
};

export default QueueTable;
