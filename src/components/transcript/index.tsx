/* eslint-disable no-unused-vars */
import EditTranscript from "@/components/editTranscript/EditTranscript";
import type { SubmitState } from "@/components/modals/SubmitTranscriptModal";
import SubmitTranscriptModal from "@/components/modals/SubmitTranscriptModal";
import SidebarContentEdit, {
  EditedContent,
} from "@/components/sideBarContentEdit/SidebarContentEdit";
import useTranscripts from "@/hooks/useTranscripts";
import { dateFormatGeneral, formatDataForMetadata } from "@/utils";
import { Button, Flex, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQueryClient } from "react-query";
import AuthStatus from "./AuthStatus";

const defaultSubmitState = {
  stepIdx: 0,
  steps: ["saving transcript to review", "fork and create pr"],
  isLoading: false,
  isError: false,
  isModalOpen: false,
  prResult: null,
  err: null,
};

const Transcript = ({ transcriptId }: { transcriptId: number }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { SingleTranscript, updateTranscript } = useTranscripts();

  const { data, isLoading, error } = SingleTranscript(transcriptId);

  const [editedData, setEditedData] = useState(data?.content?.body ?? "");

  const { mutateAsync, isLoading: saveLoading } = updateTranscript;
  const [submitState, setSubmitState] =
    useState<SubmitState>(defaultSubmitState);

  const toast = useToast();

  if (isLoading) {
    return (
      <AuthStatus
        title="Authenticated"
        message="Loading transcripts, Please wait"
      />
    );
  }

  if (!isLoading && !data) {
    return (
      <AuthStatus
        title="Error"
        message={`${
          error?.message
            ? error.message
            : "Something went wrong. Please try again later"
        }`}
      />
    );
  }

  const saveTranscript = async (editedContent: EditedContent) => {
    if (!data) return;
    const { editedCategories, editedDate, editedSpeakers, editedTitle } =
      editedContent;
    const content = data.content;
    const updatedContent = {
      ...content,
      title: editedTitle,
      speakers: editedSpeakers,
      categories: editedCategories,
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
        directoryPath: data?.content?.loc ?? "misc",
        fileName: formatDataForMetadata(editedTitle),
        url: data?.content.media,
        date: editedDate && dateFormatGeneral(editedDate, true),
        tags: formatDataForMetadata(editedTags),
        speakers: formatDataForMetadata(editedSpeakers),
        categories: formatDataForMetadata(editedCategories),
        transcribedText: editedData,
        transcript_by: formatDataForMetadata(
          data?.content?.transcript_by ?? ""
        ),
      });
      setSubmitState((prev) => ({ ...prev, stepIdx: 2, prResult }));
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
        {data && (
          <SidebarContentEdit data={data}>
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
        {data && (
          <EditTranscript
            data={data}
            mdData={editedData}
            update={setEditedData}
          />
        )}
      </Flex>
      <SubmitTranscriptModal submitState={submitState} onClose={onExitModal} />
    </>
  );
};

export default Transcript;
