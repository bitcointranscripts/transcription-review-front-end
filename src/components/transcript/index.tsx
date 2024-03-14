import SubmitTranscriptAlert from "@/components/alerts/SubmitTranscriptAlert";
import EditTranscript from "@/components/editTranscript/EditTranscript";
import type { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";
import type { SubmitState } from "@/components/modals/SubmitTranscriptModal";
import SubmitTranscriptModal from "@/components/modals/SubmitTranscriptModal";
import ReviewGuidelinesModal from "@/components/modals/ReviewGuidelinesModal";
import SidebarContentEdit from "@/components/sideBarContentEdit/SidebarContentEdit";
import config from "@/config/config.json";
import { useSubmitReview } from "@/services/api/reviews/useSubmitReview";
import { useUpdateTranscript } from "@/services/api/transcripts";
import {
  dateFormatGeneral,
  formatDataForMetadata,
  omit,
  reconcileArray,
} from "@/utils";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import MdEditor from "react-markdown-editor-lite";
import type {
  SaveToGHData,
  TranscriptContent,
  UserReviewData,
} from "../../../types";
import { compareTranscriptBetweenSave } from "@/utils/transcript";

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
  list: Record<string, string[]> & {
    speakers: string[];
    categories: string[];
    tags: string[];
  };
  loc: Record<string, string> & {
    loc: string;
  };
  text: Record<string, string> & {
    title: string;
  };
  date: Record<string, Date | null> & {
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
  const transcriptData = reviewData.transcript;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync } = useUpdateTranscript();
  const { mutateAsync: asyncSubmitReview } = useSubmitReview();
  const { data: userSession } = useSession();
  const [prRepo, setPrRepo] = useState<TranscriptSubmitOptions>(
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? "btc transcript"
      : "user"
  );
  const isFirstTime = router.query?.first_review === "true" ? true : false;

  const [editedData, setEditedData] = useState(
    transcriptData.content?.body ?? ""
  );
  const [sideBarData, setSideBarData] = useState(() => {
    const {
      speakers,
      categories,
      tags,
      title = "",
      loc = "",
      date,
      ...restContent
    } = transcriptData.content;
    const data: SideBarData = {
      list: {
        speakers: reconcileArray(speakers),
        categories: reconcileArray(categories),
        tags: reconcileArray(tags),
      },
      text: {
        title,
      },
      loc: {
        loc,
      },
      date: {
        date: date ? new Date(date) : null,
      },
    };

    for (const field of Object.keys(
      omit(restContent, ["body", "media", "transcript_by"])
    )) {
      const fieldValue = restContent[field];

      if (Array.isArray(fieldValue)) {
        data.list[field] = reconcileArray(fieldValue);
        continue;
      }

      if (typeof fieldValue === "string") {
        data.text[field] = fieldValue;
        continue;
      }

      if (fieldValue instanceof Date) {
        data.date[field] = fieldValue;
        continue;
      }
    }

    return data;
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const transcriptId = reviewData.transcript.id;
  const {
    isOpen: guidelinesIsOpen,
    onOpen: guidelinesOnOpen,
    onClose: guidelinesOnClose,
  } = useDisclosure();
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
    const { list, text, loc, date } = sideBarData;
    const content = transcriptData.content;
    const updatedContent = {
      ...content,
      ...list,
      ...text,
      ...loc,
      ...date,
      body: editedData,
    };

    return updatedContent;
  };

  const ghBranchUrl = reviewData.branchUrl;
  const ghSourcePath = transcriptData.transcriptUrl;

  useEffect(() => {
    if (isFirstTime) {
      guidelinesOnOpen();
    }
  }, [isFirstTime]);

  const saveTranscript = async (
    updatedContent: TranscriptContent,
    onSuccessCallback?: () => void,
    onNoEditsCallback?: () => void
  ) => {
    const { loc, title, date, body, ...restContent } = updatedContent;
    // create an awaitable promise for mutation

    const newImplData: SaveToGHData = {
      directoryPath: loc?.trim() ?? "",
      fileName: formatDataForMetadata(title),
      url: transcriptData.content.media,
      date: date && dateFormatGeneral(date, true),
      transcribedText: body,
      transcript_by: formatDataForMetadata(
        userSession?.user?.githubUsername ?? ""
      ),
      ghSourcePath,
      ghBranchUrl,
      reviewId: reviewData.id,
    };

    for (const field of Object.keys(
      omit(restContent, ["media", "transcript_by"])
    )) {
      const fieldValue = restContent[field];
      if (fieldValue) {
        newImplData[field] = formatDataForMetadata(fieldValue);
      }
    }

    const isPreviousHash = compareTranscriptBetweenSave(newImplData);
    if (isPreviousHash) {
      onNoEditsCallback?.();
      return;
    }

    try {
      await mutateAsync(
        { content: updatedContent, transcriptId, newImplData },
        {
          onSettled(data) {
            if (data?.statusText === "OK") {
              queryClient.invalidateQueries(["transcript", transcriptId]);
              queryClient.invalidateQueries(["review", reviewData.id]);
            }
          },
        }
      );
      onSuccessCallback?.();
    } catch (error) {
      throw error;
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
      const oldDirectoryList = localStorage.getItem("oldDirectoryList");
      const directoryList = oldDirectoryList
        ? JSON.parse(oldDirectoryList)
        : [];

      // fork and create pr
      const prResult = await axios.post("/api/github/pr", {
        directoryPath: loc?.trim() ? loc.trim() : config.defaultDirectoryPath,
        oldDirectoryList: directoryList,
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
        ghSourcePath,
        ghBranchUrl,
      });
      setSubmitState((prev) => ({ ...prev, stepIdx: 2, prResult }));
      localStorage.removeItem("oldDirectoryList");

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
      const err = error as AxiosError<{ message: string }>;
      setSubmitState((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        err,
      }));
    } finally {
      setSubmitState((prev) => ({ ...prev, isLoading: false }));
      queryClient.invalidateQueries(["review", reviewData.id]);
      localStorage.removeItem("oldDirectoryList");
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
          />
        )}
        <EditTranscript
          mdData={editedData}
          reviewData={reviewData}
          update={setEditedData}
          editorRef={editorRef}
          openGuidelines={guidelinesOnOpen}
          restoreOriginal={restoreOriginal}
          saveTranscript={saveTranscript}
          getUpdatedTranscript={getUpdatedContent}
          onOpen={onOpen}
          prRepo={prRepo}
          setPrRepo={setPrRepo}
        />
      </Flex>
      <SubmitTranscriptModal submitState={submitState} onClose={onExitModal} />
      <SubmitTranscriptAlert
        prRepo={prRepo}
        isOpen={isOpen}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
      <ReviewGuidelinesModal
        isOpen={guidelinesIsOpen}
        onCancel={guidelinesOnClose}
      />
    </>
  );
};

export default Transcript;
