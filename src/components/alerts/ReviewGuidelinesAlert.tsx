import { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import Link from "next/link";
import { forwardRef, useRef } from "react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
};

type GuidelinesContentProps = Omit<Props, "isOpen">;

const ReviewGuidelinesAlert = ({ isOpen, onCancel }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    onCancel();
  };

  return (
    <Modal size={"2xl"} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay>
        <ModalContent
          maxH={"600px"}
          p={0}
          position={"relative"}
          overflowY={"auto"}
        >
          <GuidelinesContent onCancel={onCancel} ref={cancelRef} />
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ReviewGuidelinesAlert;

const GuidelinesContent = forwardRef<HTMLButtonElement, GuidelinesContentProps>(
  ({ onCancel }, ref) => {
    return (
      <>
        <ModalHeader px={5} fontSize="lg" fontWeight="bold">
          Review Guidelines
        </ModalHeader>
        <ModalBody p={0}>
          <Text fontSize={"sm"} px={5} pb={2}>
            To ensure a shared quality of transcripts, please review and make
            sure you meet the following guidelines:
          </Text>
          <Flex flexDir={"column"} px={5} gap={2}>
            <Text>Transcription Style:</Text>
            <UnorderedList pl={3} color="gray.700" fontSize="14px">
              <ListItem>
                <Text>
                  Aim for an &quot;edited transcription &quot; style, preserving
                  text meaning without paraphrasing.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Omit stammering, filler words (&apos;like,&apos; &apos;you
                  know&apos;), and unnecessary non-verbal communication.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Maintain completeness while ensuring readability by
                  eliminating mid-sentence rephrasings and non-essential lines.
                </Text>
              </ListItem>
            </UnorderedList>
          </Flex>

          <Flex my={2} px={5} flexDir={"column"} gap={2}>
            <Text>Transcript Structure:</Text>
            <UnorderedList pl={3} color="gray.700" fontSize="14px">
              <ListItem>
                <Text>
                  Maintain original &quot;one-sentence-per-line&quot; formatting
                  and timestamps
                </Text>
              </ListItem>

              <ListItem>
                <Text>
                  Ensure coherent paragraphing around chapter titles and speaker
                  timestamps.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Break text into paragraphs and ensure accurate punctuation for
                  better readability.
                </Text>
              </ListItem>
            </UnorderedList>
          </Flex>

          <Flex my={2} px={5} flexDir={"column"} gap={2}>
            <Text>Chapters</Text>
            <UnorderedList pl={3} color="gray.700" fontSize="14px">
              <ListItem>
                <Text>
                  Include relevant chapters that break the transcript into
                  manageable segments, ensuring coherence and flow.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Utilize source materials (slides, video description, content)
                  to derive and integrate chapters.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Start chapters with H2 formatting, title is automatically
                  rendered as H1.
                </Text>
              </ListItem>
            </UnorderedList>
          </Flex>

          <Flex my={2} px={5} flexDir={"column"} gap={2}>
            <Text>Accuracy</Text>
            <UnorderedList pl={3} color="gray.700" fontSize="14px">
              <ListItem>
                <Text>
                  Identify and fix AI transcription errors, especially related
                  to technical terms and Bitcoin-specific jargon.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  For code-related technical terms or math equations, enclose
                  them in backticks (`) for clarity
                </Text>
              </ListItem>
            </UnorderedList>
          </Flex>

          <Flex my={2} px={5} flexDir={"column"} gap={2}>
            <Text>Speaker Attribution:</Text>
            <UnorderedList pl={3} color="gray.700" fontSize="14px">
              <ListItem>
                <Text>
                  Accurately attribute speakers, preventing potential mix-ups or
                  merging of dialogue caused by AI transcription errors.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Use square brackets for infrequent speaker contributions (e.g.
                  [Audience]: &quot;Hello world&quot;).
                </Text>
              </ListItem>
            </UnorderedList>
          </Flex>

          <Flex my={2} px={5} flexDir={"column"} gap={2}>
            <Text>Final Review:</Text>
            <UnorderedList pl={3} color="gray.700" fontSize="14px">
              <ListItem>
                <Text>
                  Upon completion, read through the entire transcript for
                  coherence and readability.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Add relevant tags and precise metadata (title, speaker names,
                  date) to aid content discoverability.
                </Text>
              </ListItem>
              <ListItem>
                <Text>
                  Leverage your familiarity with the material to identify
                  appropriate tags.
                </Text>
              </ListItem>
            </UnorderedList>
          </Flex>

          <Flex
            position={"sticky"}
            bottom={"0px"}
            width={"100%"}
            py={2}
            backgroundColor={"white"}
            direction="column"
            gap={3}
          >
            <Button
              size="sm"
              colorScheme="orange"
              mx="auto"
              ref={ref}
              onClick={onCancel}
            >
              Got it, ready for review!
            </Button>
          </Flex>
        </ModalBody>
      </>
    );
  }
);

GuidelinesContent.displayName = "GuidelinesContent";
