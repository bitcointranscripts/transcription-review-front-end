/* eslint-disable no-unused-vars */
import SubmitTranscriptAlert from "@/components/alerts/SubmitTranscriptAlert";
import EditTranscript from "@/components/editTranscript/EditTranscript";
import type { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";
import SubmitTranscriptMenu from "@/components/menus/SubmitTranscriptMenu";
import type { SubmitState } from "@/components/modals/SubmitTranscriptModal";
import SubmitTranscriptModal from "@/components/modals/SubmitTranscriptModal";
import SidebarContentEdit from "@/components/sideBarContentEdit/SidebarContentEdit";
import { useSubmitReview } from "@/services/api/reviews/useSubmitReview";
import { useUpdateTranscript } from "@/services/api/transcripts";
import {
  dateFormatGeneral,
  formatDataForMetadata,
  reconcileArray,
} from "@/utils";
import { Button, Flex, useDisclosure, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import type { UserReview } from "../../../types";

const defaultSubmitState = {
  stepIdx: 0,
  steps: ["saving transcript to review", "fork and create pr"],
  isLoading: false,
  isError: false,
  isModalOpen: false,
  prResult: null,
  err: null,
};

export type SideBarData = {
  list: {
    speakers: string[];
    categories: string[];
    tags: string[];
  };
  text: {
    title: string;
  };
  date: {
    date: Date | null;
  };
};

export type SidebarType = keyof SideBarData;

export type SidebarSubType<T extends SidebarType> = keyof SideBarData[T];

export type sideBarContentUpdateParams<T, K> = {
  data: string | string[] | Date | null;
  type: T;
  name: K;
};

const Transcript = ({ reviewData }: { reviewData: UserReview }) => {
  const transcriptId = reviewData.transcript.id;
  const transcriptData = reviewData.transcript;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading: saveLoading } = useUpdateTranscript();
  const { mutateAsync: asyncSubmitReview } = useSubmitReview();
  const { data: userSession } = useSession();
  const isAdmin = userSession?.user?.permissions === "admin";

  const [prRepo, setPrRepo] = useState<TranscriptSubmitOptions>("user");
  const [editedData, setEditedData] = useState(
    transcriptData.content?.body ?? ""
  );
  const [sideBarData, setSideBarData] = useState({
    list: {
      speakers: reconcileArray(transcriptData?.content?.speakers),
      categories: reconcileArray(transcriptData?.content?.categories),
      tags: reconcileArray(transcriptData?.content?.tags),
    },
    text: {
      title: transcriptData.content?.title ?? "",
    },
    date: {
      date: transcriptData.content?.date
        ? new Date(transcriptData.content.date)
        : null,
    },
  });

  const sideBarContentUpdater = <
    T extends keyof SideBarData,
    K extends SidebarSubType<T>
  >({
    name,
    data,
    type,
  }: sideBarContentUpdateParams<T, K>) => {
    setSideBarData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: data,
      },
    }));
  };

  const [submitState, setSubmitState] =
    useState<SubmitState>(defaultSubmitState);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const restoreOriginal = () => {
    if (!transcriptData?.originalContent) return;
    // TODO: make an API call to update
    setSideBarData({
      list: {
        speakers: reconcileArray(transcriptData.originalContent?.speakers),
        categories: reconcileArray(transcriptData.originalContent?.categories),
        tags: reconcileArray(transcriptData.originalContent?.tags),
      },
      text: {
        title: transcriptData.originalContent.title,
      },
      date: {
        date: transcriptData.originalContent?.date
          ? new Date(transcriptData.originalContent.date)
          : null,
      },
    });
    setEditedData(transcriptData.originalContent.body ?? "");
  };

  const saveTranscript = async () => {
    const {
      list: { speakers, categories, tags },
      text: { title },
      date: { date },
    } = sideBarData;
    const content = transcriptData.content;
    const updatedContent = {
      ...content,
      title,
      speakers,
      categories,
      tags,
      date,
      body: editedData,
    };
    // create an awaitable promise for mutation
    try {
      await mutateAsync(
        { content: updatedContent, transcriptId },
        {
          onSettled(data) {
            if (data?.statusText === "OK") {
              queryClient.invalidateQueries(["transcript", transcriptId]);
            }
          },
        }
      );
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      await saveTranscript();
      toast({
        status: "success",
        title: "Saved successfully",
      });
    } catch (err: any) {
      toast({
        status: "error",
        title: "Error while saving",
        description: err?.message,
      });
    }
  };

  const handleSubmit = async () => {
    const {
      list: { speakers, categories, tags },
      text: { title },
      date: { date },
    } = sideBarData;
    setSubmitState((prev) => ({ ...prev, isLoading: true, isModalOpen: true }));
    try {
      // save transcript
      await saveTranscript();
      setSubmitState((prev) => ({ ...prev, stepIdx: 1 }));

      // fork and create pr
      const prResult = await axios.post("/api/github/pr", {
        directoryPath: transcriptData?.content?.loc ?? "misc",
        fileName: formatDataForMetadata(title),
        url: transcriptData?.content.media,
        date: date && dateFormatGeneral(date, true),
        tags: formatDataForMetadata(tags),
        speakers: formatDataForMetadata(speakers),
        categories: formatDataForMetadata(categories),
        transcribedText: editedData,
        transcript_by: formatDataForMetadata(
          transcriptData?.content?.transcript_by ?? ""
        ),
        prRepo,
      });
      setSubmitState((prev) => ({ ...prev, stepIdx: 2, prResult }));

      // update pr_url
      await asyncSubmitReview(
        { pr_url: prResult?.data?.html_url, reviewId: reviewData.id },
        {
          onSettled(data) {
            if (data?.statusText === "OK") {
              queryClient.invalidateQueries(["review", reviewData.id]);
            }
          },
        }
      );
    } catch (error) {
      const err = error as Error;
      setSubmitState((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        err,
      }));
    } finally {
      setSubmitState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const onExitModal = () => {
    setSubmitState(defaultSubmitState);
    router.push("/");
  };

  return (
    <>
      <Flex gap={6} w="full" flexDir={{ base: "column", md: "row" }}>
        {transcriptData && (
          <SidebarContentEdit
            data={transcriptData}
            claimedAt={reviewData.createdAt}
            sideBarData={sideBarData}
            updater={sideBarContentUpdater}
          >
            <Flex gap={2}>
              <Button
                size="sm"
                colorScheme="orange"
                variant="outline"
                onClick={handleSave}
                isLoading={saveLoading}
              >
                Save
              </Button>
              <Button
                gap={2}
                size="sm"
                colorScheme="orange"
                onClick={!isAdmin ? onOpen : handleSubmit}
              >
                Submit {isAdmin ? `(${prRepo})` : ""}
                {isAdmin && <SubmitTranscriptMenu setPrRepo={setPrRepo} />}
              </Button>
            </Flex>
          </SidebarContentEdit>
        )}
        <EditTranscript
          data={transcriptData}
          mdData={editedData}
          update={setEditedData}
          restoreOriginal={restoreOriginal}
        />
      </Flex>
      <SubmitTranscriptModal submitState={submitState} onClose={onExitModal} />
      <SubmitTranscriptAlert
        isOpen={isOpen}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Transcript;
