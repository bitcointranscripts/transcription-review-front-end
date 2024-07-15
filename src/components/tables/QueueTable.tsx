import {
  useHasExceededMaxActiveReviews,
  useUserMultipleReviews,
} from "@/services/api/reviews";
import {
  useArchiveTranscript,
  useTranscripts,
} from "@/services/api/transcripts";
import {
  calculateReadingTime,
  convertStringToArray,
  displaySatCoinImage,
} from "@/utils";
import { useGithub } from "@/services/api/github";
import {
  Button,
  Flex,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiBookAdd } from "react-icons/bi";
import { Transcript } from "../../../types";
import { SuggestModal } from "@/components/modals";
import BaseTable from "./BaseTable";
import Pagination from "./Pagination";
import { ArchiveButton } from "./TableItems";
import TitleWithTags from "./TitleWithTags";
import { TableStructure } from "./types";
import { useHasPermission } from "@/hooks/useHasPermissions";

const QueueTable = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const archiveTranscript = useArchiveTranscript();
  const canArchiveTranscripts = useHasPermission("archiveTranscripts");
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    isOpen: showSuggestModal,
    onClose: closeSuggestModal,
    onOpen: openSuggestModal,
  } = useDisclosure();
  const router = useRouter();
  const { claimTranscript } = useGithub();
  const { data, isLoading, isError, refetch } = useTranscripts(currentPage);
  const hasExceededActiveReviewLimit = useHasExceededMaxActiveReviews(
    session?.user?.id
  );
  const [totalPages, setTotalPages] = useState<number>(data?.totalPages || 0);
  const toast = useToast();

  const retriedClaim = useRef(0);

  const [selectedTranscriptId, setSelectedTranscriptId] = useState(-1);
  const { data: multipleStatusData } = useUserMultipleReviews({
    userId: session?.user?.id,
    multipleStatus: ["pending", "active", "inactive"],
  });

  const handleArchive = async () => {
    const ids = selectedIds.map(Number);

    if (session?.user?.id) {
      const archivedBy = session?.user?.id;
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

  const retryLoginAndClaim = async (transcriptId: number) => {
    await signOut({ redirect: false });
    if (retriedClaim.current < 2) {
      retriedClaim.current += 1;
      await signIn("github", {
        callbackUrl: `/?reclaim=true&transcriptId=${transcriptId}`,
      });
    }
  };

  const handleClaim = useCallback(
    async (transcriptId: number) => {
      if (hasExceededActiveReviewLimit) {
        toast({
          status: "error",
          title:
            "Please finish editing & submit the transcript you're working on first",
        });
        return;
      }
      // handle new implementation
      const transcript = data?.data?.find((item) => item.id === transcriptId);

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
          callbackUrl: `/?reclaim=true&transcriptId=${transcriptId}`,
        });
        return;
      }
      if (session?.user?.id && transcript) {
        setSelectedTranscriptId(transcriptId);

        try {
          await claimTranscript.mutateAsync({
            transcriptUrl: transcript.transcriptUrl,
            transcriptId,
            userId: session.user.id,
          });
        } catch (error: any) {
          // handles all errors from claiming process
          let errorTitle = error.message;
          if (error.response) {
            // for errors coming from axios requests
            // we display our custom error message
            errorTitle = error.response.data.message;
          }
          setSelectedTranscriptId(-1);
          toast({
            status: "error",
            title: errorTitle,
          });
        }
      } else {
        await retryLoginAndClaim(transcriptId);
      }
    },
    [
      hasExceededActiveReviewLimit,
      data?.data,
      status,
      session?.user?.id,
      toast,
      claimTranscript,
      multipleStatusData.length,
      router,
    ]
  );
  // updated totalPages if data changes
  useEffect(() => {
    if (data) {
      setTotalPages(data?.totalPages || 0);
    }
  }, [data]);
  // Reclaim transcript when there's a reclaim query
  useEffect(() => {
    const { reclaim, transcriptId } = router.query;
    if (
      reclaim &&
      transcriptId &&
      data &&
      status === "authenticated" &&
      retriedClaim.current < 2
    ) {
      retriedClaim.current = 2;
      handleClaim(Number(transcriptId));
    }
  }, [data, router, handleClaim, status]);

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
                loc={data.content.loc}
                transcriptUrl={data.transcriptUrl}
                id={data.id}
                length={allTags.length}
                shouldSlice={false}
              />
            );
          },
        },
        {
          name: "speakers",
          type: "text-long",
          modifier: (data) => data.content.speakers.join(", "),
        },
        {
          name: "Time to edit",
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
            <Flex
              position="relative"
              className="responsive-image"
              width={"70%"}
              minWidth={"10px"}
              minHeight={"42px"}
              justifyContent={"start"}
              alignItems={"start"}
              height="100%"
            >
              <Image
                alt={`${data.contentTotalWords} sat coins`}
                src={displaySatCoinImage(data.contentTotalWords)}
                objectFit="contain"
                fill
              />
            </Flex>
          ),
          component: (data) => (
            <Flex
              position="relative"
              className="responsive-image"
              width={"100%"}
              minWidth={"10px"}
              minHeight={"42px"}
              justifyContent={"start"}
              alignItems={"start"}
              height="100%"
            >
              <Image
                alt={`${data.contentTotalWords} sat coins`}
                src={displaySatCoinImage(data.contentTotalWords)}
                objectFit="contain"
                width={24}
                height={24}
              />
            </Flex>
          ),
        },
        {
          name: "Claim",
          actionName: "Claim",
          type: "action",
          modifier: (data) => data.id,
          component: (data) => (
            <Button
              isDisabled={selectedTranscriptId !== -1}
              isLoading={data.id == selectedTranscriptId}
              bgColor={"#EB9B00"}
              color="white"
              _hover={{ bgColor: "#EB9B00AE" }}
              _active={{ bgColor: "#EB9B0050" }}
              size="sm"
              onClick={() => handleClaim(data.id)}
            >
              Claim
            </Button>
          ),
        },
      ] as TableStructure<Transcript>[],
    [handleClaim, selectedTranscriptId]
  );

  return (
    <>
      <BaseTable
        actionItems={
          <>
            <Button
              size="sm"
              gap={2}
              colorScheme="orange"
              variant="outline"
              onClick={openSuggestModal}
            >
              Suggest source
              <BiBookAdd />
            </Button>

            {selectedIds.length > 0 && (
              <ArchiveButton
                isLoading={archiveTranscript.isLoading}
                handleRequest={handleArchive}
              />
            )}
          </>
        }
        data={data?.data}
        emptyView="There are no transcripts awaiting review"
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        enableCheckboxes={canArchiveTranscripts}
        selectedRowIds={selectedIds}
        onSelectedRowIdsChange={setSelectedIds}
        getRowId={(row) => `${row.id}`}
        tableHeader="Transcripts waiting for review"
        tableStructure={tableStructure}
      />
      <Pagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        pages={totalPages}
      />
      <SuggestModal handleClose={closeSuggestModal} isOpen={showSuggestModal} />
    </>
  );
};

export default QueueTable;
