import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { MutableRefObject, useEffect, useState } from "react";
import MarkdownIt from "markdown-it";

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
}: {
  mdData: string;
  editorRef: MutableRefObject<MdEditor | null>;
  // eslint-disable-next-line no-unused-vars
  update: (x: any) => void;
  restoreOriginal: () => void;
}) => {
  const [isPreviewOnly, setIsPreviewOnly] = useState(false);
  const [isModalOpen, setIsModalopen] = useState(false);

  const mdParser = new MarkdownIt();

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
        <Box my={2}>
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
        </Box>
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
