/* eslint-disable no-unused-vars */
import {
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { Transcript } from "../../../types";
import SidebarContentEdit, {
  EditedContent,
} from "@/components/sideBarContentEdit/SidebarContentEdit";
import EditTranscript from "@/components/editTranscript/EditTranscript";
import useTranscripts from "@/hooks/useTranscripts";
import { useRouter } from "next/router";
import RedirectToLogin from "@/components/RedirectToLogin";
import { useQueryClient } from "react-query";
import axios from "axios";

const TranscriptPage = () => {
  const { status, data: sessionData } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const queryClient = useQueryClient();

  const { SingleTranscript, updateTranscript } = useTranscripts();

  const { data, isLoading } = SingleTranscript(Number(id));
  const { mutate, isLoading: saveLoading } = updateTranscript;
  const [editedData, setEditedData] = useState(data?.content?.body ?? "");
  const [submitLoading, setSubmitLoading] = useState(false);

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

  const handleSave = (editedContent: EditedContent) => {
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
            toast({
              status: "error",
              title: "Error while saving",
              description: data.message,
            });
          } else if (data?.statusText === "OK") {
            toast({
              status: "success",
              title: "Saved successfully",
            });
            queryClient.invalidateQueries(["transcript", Number(id)]);
          }
        },
      }
    );
  };

  const handleSubmit = async (editedContent: EditedContent) => {
    setSubmitLoading(true);
    axios
      .post("/api/github/pr", {
        directoryPath: data?.content.loc ?? "bitcointranscripts/misc",
        fileName: "Sample Test Transcript",
        url: data?.content.media,
        transcribedText: editedData,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        setSubmitLoading(false);
      });
    return;
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
                    isLoading={submitLoading}
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
