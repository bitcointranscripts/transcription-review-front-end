/* eslint-disable no-unused-vars */
import { Button, Flex, useToast } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import React, { useState } from "react";
import SidebarContentEdit, {
  EditedContent,
} from "@/components/sideBarContentEdit/SidebarContentEdit";
import EditTranscript from "@/components/editTranscript/EditTranscript";
import useTranscripts from "@/hooks/useTranscripts";
import { useRouter } from "next/router";
import RedirectToLogin from "@/components/RedirectToLogin";
import { useQueryClient } from "react-query";
import axios from "axios";
import { dateFormat, formatDataForMetadata } from "@/utils";
import SubmitTranscriptModal from "@/components/modals/SubmitTranscriptModal";
import type { SubmitState } from "@/components/modals/SubmitTranscriptModal";

const defaultSubmitState = {
  stepIdx: 0,
  steps: ["saving transcript to review", "fork and create pr"],
  isLoading: false,
  isError: false,
  isModalOpen: false,
  prResult: null,
};

const TranscriptPage = () => {
  const { status, data: sessionData } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const queryClient = useQueryClient();

  const { SingleTranscript, updateTranscript } = useTranscripts();

  const { data, isLoading } = SingleTranscript(Number(id));
  const { mutate, isLoading: saveLoading } = updateTranscript;
  const [editedData, setEditedData] = useState(data?.content?.body ?? "");
  const [submitState, setSubmitState] =
    useState<SubmitState>(defaultSubmitState);

  const toast = useToast();

  if (status === "loading") {
    return (
      <>
        <h2>Authenticating...</h2>
        <p>Please wait</p>
      </>
    );
  }
  if (status === "unauthenticated") {
    return <RedirectToLogin />;
  }

  if (!isLoading && !data) {
    return null;
  }

  // if (data.status === "queued") {
  //   return <h4>Transcript has been claimed</h4>;
  // }

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
    mutate(
      { content: updatedContent, transcriptId: Number(id) },
      {
        onSettled(data, error, context) {
          if (data instanceof Error) {
            throw data;
          } else if (data?.statusText === "OK") {
            queryClient.invalidateQueries(["transcript", Number(id)]);
          } else if (error) {
            throw error;
          }
        },
      }
    );
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
        directoryPath: data?.content.loc ?? "misc",
        fileName: formatDataForMetadata(editedTitle),
        url: data?.content.media,
        date: editedDate && dateFormat(editedDate),
        tags: formatDataForMetadata(editedTags),
        speakers: formatDataForMetadata(editedSpeakers),
        categories: formatDataForMetadata(editedCategories),
        transcribedText: editedData,
        transcript_by: formatDataForMetadata(
          data?.content?.transcript_by ?? ""
        ),
      });
      setSubmitState((prev) => ({ ...prev, stepIdx: 2, prResult }));
    } catch (err) {
      setSubmitState((prev) => ({ ...prev, isLoading: false, isError: true }));
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
      {isLoading ? (
        <p> Loading...</p>
      ) : (
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
      )}
      <SubmitTranscriptModal submitState={submitState} onClose={onExitModal} />
    </>
  );
};

// export const getServerSideProps: GetServerSideProps<{
//   data: Transcript;
// }> = async ({ params }) => {
//   const id = params?.id;

//   const fetchedData = await fetch(`${process.env.BASE_URL}/transcripts/${id}`);
//   const data = await fetchedData.json();

//   return {
//     props: {
//       data,
//     },
//   };
// };

export default TranscriptPage;
