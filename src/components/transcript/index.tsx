/* eslint-disable no-unused-vars */
import EditTranscript from "@/components/editTranscript/EditTranscript";
import type { SubmitState } from "@/components/modals/SubmitTranscriptModal";
import SubmitTranscriptModal from "@/components/modals/SubmitTranscriptModal";
import SidebarContentEdit, {
  EditedContent
} from "@/components/sideBarContentEdit/SidebarContentEdit";
import { useTranscript, useUpdateTranscript } from "@/services/api/transcripts";
import { dateFormatGeneral, formatDataForMetadata, reconcileArray } from "@/utils";
import { Button, Flex, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AuthStatus from "./AuthStatus";
import type { Review, UserReview } from "../../../types";
import { useSubmitReview } from "@/services/api/reviews/useSubmitReview";

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

const contentDate = (date: Date | null | undefined) => {
  console.log("I keep running")
  if (date) {
    return new Date(date);
  }
  return null;
};

const Transcript = ({ reviewData }: { reviewData: UserReview }) => {
  const transcriptId = reviewData.transcript.id;
  const transcriptData = reviewData.transcript;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading: saveLoading } = useUpdateTranscript();
  const { mutateAsync: asyncSubmitReview, isLoading: submitReviewIsLoading } = useSubmitReview();

  const [editedData, setEditedData] = useState(transcriptData.content.body ?? "");
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
      date: transcriptData.content?.date ? new Date(transcriptData.content?.date) : null,
    },
  });

  const sideBarContentUpdater = <T extends keyof SideBarData, K extends SidebarSubType<T>>({
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
        date: transcriptData.originalContent?.date ? new Date(transcriptData.originalContent.date) : null,
      },
    });
    setEditedData(transcriptData.originalContent.body ?? "");
  };

  const saveTranscript = async (editedContent: EditedContent) => {
    if (!transcriptData) return;
    const {
      editedCategories,
      editedDate,
      editedSpeakers,
      editedTitle,
      editedTags,
    } = editedContent;
    const content = transcriptData.content;
    const updatedContent = {
      ...content,
      title: editedTitle,
      speakers: editedSpeakers,
      categories: editedCategories,
      tags: editedTags,
      date: editedDate,
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

  const handleSave = async (editedContent: EditedContent) => {
    try {
      await saveTranscript(editedContent);
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

  const handleSubmit = async (editedContent: EditedContent) => {
    const {
      editedTitle,
      editedDate,
      editedTags,
      editedSpeakers,
      editedCategories,
    } = editedContent;
    setSubmitState((prev) => ({ ...prev, isLoading: true, isModalOpen: true }));
    try {
      // save transcript
      await saveTranscript(editedContent);
      setSubmitState((prev) => ({ ...prev, stepIdx: 1 }));

      // fork and create pr
      const prResult = await axios.post("/api/github/pr", {
        directoryPath: transcriptData?.content?.loc ?? "misc",
        fileName: formatDataForMetadata(editedTitle),
        url: transcriptData?.content.media,
        date: editedDate && dateFormatGeneral(editedDate, true),
        tags: formatDataForMetadata(editedTags),
        speakers: formatDataForMetadata(editedSpeakers),
        categories: formatDataForMetadata(editedCategories),
        transcribedText: editedData,
        transcript_by: formatDataForMetadata(
          transcriptData?.content?.transcript_by ?? ""
        ),
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
            {(editedContent) => (
              <Flex gap={2}>
                <Button
                  size="sm"
                  colorScheme="orange"
                  variant="outline"
                  onClick={() => handleSave(editedContent)}
                  isLoading={saveLoading}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  colorScheme="orange"
                  onClick={() => handleSubmit(editedContent)}
                >
                  Submit
                </Button>
              </Flex>
            )}
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
    </>
  );
};

export default Transcript;
