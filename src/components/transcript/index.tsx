import SubmitTranscriptAlert from "@/components/alerts/SubmitTranscriptAlert";
import EditTranscript from "@/components/editTranscript/EditTranscript";
import type { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";
import SubmitTranscriptMenu from "@/components/menus/SubmitTranscriptMenu";
import type { SubmitState } from "@/components/modals/SubmitTranscriptModal";
import SubmitTranscriptModal from "@/components/modals/SubmitTranscriptModal";
import SidebarContentEdit from "@/components/sideBarContentEdit/SidebarContentEdit";
import config from "@/config/config.json";
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
import { useRef, useState } from "react";
import MdEditor from "react-markdown-editor-lite";
import type { TranscriptContent, UserReviewData } from "../../../types";

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
  loc: {
    loc: string;
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

const Transcript = ({ reviewData }: { reviewData: UserReviewData }) => {
  const transcriptId = reviewData.transcript.id;
  const transcriptData = reviewData.transcript;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading: saveLoading } = useUpdateTranscript();
  const { mutateAsync: asyncSubmitReview } = useSubmitReview();
  const { data: userSession } = useSession();
  const isAdmin = userSession?.user?.permissions === "admin";
  const [prRepo, setPrRepo] = useState<TranscriptSubmitOptions>(
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? "btc transcript"
      : "user"
  );
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
    loc: {
      loc: transcriptData?.content?.loc ?? "",
    },
    date: {
      date: transcriptData.content?.date
        ? new Date(transcriptData.content.date)
        : null,
    },
  });

  const sideBarContentUpdater = <
    T extends keyof SideBarData,
    K extends SidebarSubType<T>,
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
  const editorRef = useRef<MdEditor | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const restoreOriginal = () => {
    if (!transcriptData?.originalContent) return;
    editorRef.current?.setText(transcriptData.originalContent?.body);
    setSideBarData({
      list: {
        speakers: reconcileArray(transcriptData.originalContent?.speakers),
        categories: reconcileArray(transcriptData.originalContent?.categories),
        tags: reconcileArray(transcriptData.originalContent?.tags),
      },
      text: {
        title: transcriptData.originalContent.title,
      },
      loc: {
        loc: transcriptData?.content?.loc ?? "",
      },
      date: {
        date: transcriptData.originalContent?.date
          ? new Date(transcriptData.originalContent.date)
          : null,
      },
    });
    setEditedData(transcriptData.originalContent.body ?? "");
  };

  const getUpdatedContent = () => {
    const {
      list: { speakers, categories, tags },
      text: { title },
      loc: { loc },
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
      loc,
      body: editedData,
    };

    return updatedContent;
  };

  const saveTranscript = async (updatedContent: TranscriptContent) => {
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
      await saveTranscript(getUpdatedContent());
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
      loc: { loc },
      date: { date },
    } = sideBarData;
    setSubmitState((prev) => ({ ...prev, isLoading: true, isModalOpen: true }));
    try {
      // save transcript
      await saveTranscript(getUpdatedContent());
      setSubmitState((prev) => ({ ...prev, stepIdx: 1 }));

      // fork and create pr
      const prResult = await axios.post("/api/github/pr", {
        directoryPath: loc?.trim() ? loc.trim() : config.defaultDirectoryPath,
        fileName: formatDataForMetadata(title),
        url: transcriptData?.content.media,
        prUrl: reviewData?.pr_url,
        date: date && dateFormatGeneral(date, true),
        tags: formatDataForMetadata(tags),
        speakers: formatDataForMetadata(speakers),
        categories: formatDataForMetadata(categories),
        transcribedText: editedData,
        transcript_by: formatDataForMetadata(
          userSession?.user?.githubUsername ?? ""
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
            getUpdatedTranscript={getUpdatedContent}
            saveTranscript={saveTranscript}
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
              <Flex
                overflow="hidden"
                borderRadius="md"
                bg="orange.500"
                dir="row"
              >
                <Button
                  borderRadius="none"
                  size="sm"
                  colorScheme="orange"
                  onClick={onOpen}
                >
                  Submit {isAdmin ? `(${prRepo})` : ""}
                </Button>
                {isAdmin && (
                  <>
                    <SubmitTranscriptMenu setPrRepo={setPrRepo} />
                  </>
                )}
              </Flex>
            </Flex>
          </SidebarContentEdit>
        )}
        <EditTranscript
          mdData={editedData}
          update={setEditedData}
          editorRef={editorRef}
          restoreOriginal={restoreOriginal}
        />
      </Flex>
      <SubmitTranscriptModal submitState={submitState} onClose={onExitModal} />
      <SubmitTranscriptAlert
        prRepo={prRepo}
        isOpen={isOpen}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Transcript;
