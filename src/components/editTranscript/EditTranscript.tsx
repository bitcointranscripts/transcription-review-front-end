import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";

import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import MarkdownIt from "markdown-it";
import { FaBook } from "react-icons/fa";
import SubmitTranscriptMenu, {
  TranscriptSubmitOptions,
} from "../menus/SubmitTranscriptMenu";
import { TranscriptContent, UserReviewData } from "../../../types";
import { useUpdateTranscript } from "@/services/api/transcripts";
import { useHasPermission } from "@/hooks/useHasPermissions";
// Interfaces for react-markdown-editior
export interface IHandleEditorChange {
  text: string;
  html: string;
}

export interface IStateChange {
  md: boolean;
  html: boolean;
  menu: true;
}
const EditTranscript = ({
  mdData,
  update,
  restoreOriginal,
  editorRef,
  openGuidelines,
  reviewData,
  saveTranscript,
  getUpdatedTranscript,
  onOpen,
  prRepo,
  setPrRepo,
}: {
  mdData: string;
  prRepo: TranscriptSubmitOptions;
  setPrRepo: Dispatch<SetStateAction<TranscriptSubmitOptions>>;
  editorRef: MutableRefObject<MdEditor | null>;
  // eslint-disable-next-line no-unused-vars
  update: (x: any) => void;
  restoreOriginal: () => void;
  openGuidelines: () => void;
  reviewData: UserReviewData;
  saveTranscript: (
    updatedContent: TranscriptContent,
    onSuccessCallback?: () => void,
    onNoEditsCallback?: () => void
  ) => Promise<void>;
  getUpdatedTranscript: () => TranscriptContent;
  onOpen: () => void;
}) => {
  const [isPreviewOnly, setIsPreviewOnly] = useState(false);
  const [isModalOpen, setIsModalopen] = useState(false);
  const toast = useToast();
  const mdParser = new MarkdownIt();

  const reviewSubmissionDisabled =
    !!reviewData.branchUrl && !!reviewData.pr_url;

  const canEditAdminTranscripts = useHasPermission("editAdminTranscripts");

  const { isLoading: saveLoading } = useUpdateTranscript();

  const handleSave = async () => {
    const onSuccessCallback = () => {
      toast({
        status: "success",
        title: "Saved successfully",
      });
    };
    const onNoEditsCallback = () => {
      toast({
        status: "warning",
        title: "Unable to save because no edits have been made",
      });
    };
    try {
      await saveTranscript(
        getUpdatedTranscript(),
        onSuccessCallback,
        onNoEditsCallback
      );
    } catch (err: any) {
      toast({
        status: "error",
        title: "Error while saving",
        description: err?.message,
      });
    }
  };

  // Finish!
  function handleEditorChange({ text }: IHandleEditorChange) {
    update(text);
  }
  // hijack params of mdEditor to change toolbar "preview" function
  useEffect(() => {
    editorRef.current?.on("viewchange", (state: IStateChange) => {
      if (state.md && state.html) {
        setIsPreviewOnly(false);
      } else if (state.md) {
        setIsPreviewOnly(false);
      } else {
        setIsPreviewOnly(true);
      }
    });
  }, [editorRef]);

  useEffect(() => {
    if (isPreviewOnly) {
      editorRef?.current?.setView({
        html: true,
        md: false,
        menu: true,
      });
    } else {
      editorRef?.current?.setView({
        html: false,
        md: true,
        menu: true,
      });
    }
  }, [editorRef, isPreviewOnly]);

  // restoreOriginal content function
  const onClickRestore = () => {
    restoreOriginal();
    setIsModalopen(false);
  };

  return (
    <>
      <Box
        flex="1 1 70%"
        w={{ base: "100%", md: "70%" }}
        display="flex"
        flexDir="column"
      >
        <Flex
          my={2}
          flexWrap={"wrap"}
          rowGap={4}
          justifyContent={"space-between"}
        >
          <Flex gap={2}>
            <Button
              colorScheme="orange"
              onClick={openGuidelines}
              size="xs"
              ml="auto"
              display="flex"
              gap={"4px"}
              variant="solid"
            >
              <FaBook /> Review Guidelines
            </Button>
            <Button
              colorScheme="gray"
              onClick={() => setIsModalopen(true)}
              size="xs"
              ml="auto"
              display="block"
              variant="outline"
            >
              Restore Original
            </Button>
          </Flex>

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
            <Flex overflow="hidden" borderRadius="md" dir="row">
              <Tooltip
                label={
                  reviewSubmissionDisabled
                    ? "You cannot resubmit a submitted review, instead use save to update your submission"
                    : undefined
                }
              >
                <Button
                  borderRadius="none"
                  size="sm"
                  colorScheme="orange"
                  onClick={onOpen}
                  isDisabled={reviewSubmissionDisabled}
                >
                  Submit {canEditAdminTranscripts ? `(${prRepo})` : ""}
                </Button>
              </Tooltip>
              {canEditAdminTranscripts && (
                <>
                  <SubmitTranscriptMenu setPrRepo={setPrRepo} />
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Box h="full" id="simplemde-container-controller">
          <MdEditor
            ref={editorRef}
            defaultValue={mdData?.replace(/\\n/g, "\n") ?? ""}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            htmlClass={isPreviewOnly ? "hide-editor" : ""}
            markdownClass="full"
          />
        </Box>
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalopen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text align="center" fontWeight={600} fontSize="md" color="red.600">
              Restore Original
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure? All changes will be lost.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalopen(false)}
              mr={2}
            >
              Cancel
            </Button>
            <Button colorScheme="red" size="sm" onClick={onClickRestore}>
              Yes, Restore!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditTranscript;
