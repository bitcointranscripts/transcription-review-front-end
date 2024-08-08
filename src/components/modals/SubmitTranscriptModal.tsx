import { SubmitReviewParams } from "@/services/api/github";
import { discordInvites } from "@/utils";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Spinner,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { BiCheck, BiX } from "react-icons/bi";
import { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";
import { UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "next/router";

type Props = {
  submitReview: UseMutationResult<any, unknown, SubmitReviewParams, unknown>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  prRepo: TranscriptSubmitOptions;
};

type SubmitContentProps = {
  status: string;
  data?: string;
  error: any;
};

type ReviewEditsContentProps = Pick<Props, "onClose" | "onSubmit" | "prRepo">;

const ConfirmSubmitModalContent = ({
  onClose: closeModal,
  onSubmit: submitTranscript,
  prRepo,
}: ReviewEditsContentProps) => {
  return (
    <>
      <ModalHeader fontSize="xl">Let&apos;s review your edits</ModalHeader>
      <ModalBody>
        <Heading size="sm" pb={2}>
          Did you make sure the following are accurate?
        </Heading>
        <UnorderedList color="gray.700" fontSize="14px">
          <ListItem>
            <Text>Title</Text>
          </ListItem>
          <ListItem>
            <Text>Speaker(s)</Text>
          </ListItem>
          <ListItem>
            <Text>Date of original presentation</Text>
          </ListItem>
          <ListItem>
            <Text>Tags for the main topics of discussion</Text>
          </ListItem>
        </UnorderedList>
        <Flex my={4} direction="column" gap={3}>
          <Text size="sm" pb={2}>
            <Text fontWeight="bold">Did you follow the Review Guidelines?</Text>
            Please confirm you have corrected AI errors, adopted a clean
            verbatim transcription style, maintained structure and organized
            chapters effectively, attributed speakers accurately, and conducted
            a final coherence check to ensure the transcript is not only
            accurate but also readable.
          </Text>
          <Button size="sm" mx="auto" onClick={closeModal}>
            Let me check a few things
          </Button>
        </Flex>
      </ModalBody>
      <ModalBody>
        By hitting submit, this would create a PR on{" "}
        <b>
          {prRepo === "btc transcript"
            ? "the Bitcoin Transcript repo"
            : "your repo"}
        </b>{" "}
      </ModalBody>
      <ModalFooter gap={3}>
        <Button
          display="block"
          size="sm"
          mx="auto"
          colorScheme="blue"
          onClick={() => {
            submitTranscript();
          }}
        >
          Ready to ship! <span>🚢</span>
        </Button>
      </ModalFooter>
    </>
  );
};

const SubmitModalContent = ({
  status,
  data: prUrl,
  error,
}: SubmitContentProps) => {
  const errorMessage = error?.response?.data?.message || error?.message;
  return (
    <>
      <ModalHeader>Submitting Transcript</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Flex alignItems="center" gap={2}>
          {status == "loading" && (
            <Spinner color="orange.300" size="sm" thickness="2px" />
          )}
          {status == "success" && (
            <Icon as={BiCheck} color="green.400" boxSize={6} />
          )}
          {status == "error" && <Icon as={BiX} color="red.400" boxSize={6} />}
          <Text
            fontSize="16px"
            color={
              status == "loading"
                ? "orange.400"
                : status == "success"
                ? "green.400"
                : "red.400"
            }
            fontWeight={600}
          >
            Submitting transcript for evaluation
          </Text>
        </Flex>

        <Box my={4}>
          {status == "error" && (
            <Box>
              <Text color="gray.400" fontWeight={500}>
                Unsuccessful
              </Text>
              {error?.message && (
                <>
                  <Divider mt={1} mb={3} />
                  <Text color="red.400">{errorMessage}</Text>
                </>
              )}
            </Box>
          )}
          {status == "success" && prUrl && (
            <>
              <Heading size="md">Thanks for your help!</Heading>
              <Flex
                fontSize="16px"
                color="gray.600"
                direction={"column"}
                pt={2}
                gap={1}
              >
                <Text>The edits will be reviewed before publishing.</Text>
                <Text>
                  You will receive a confirmation on GitHub once it is merged
                  and live on btctranscripts.com.
                </Text>
                <Text>
                  Corrections and conversations about this transcript will shift
                  to GitHub on your PR linked{" "}
                  <Link
                    as={NextLink}
                    href={prUrl}
                    target="_blank"
                    color="blue.400"
                  >
                    here
                  </Link>
                  .
                </Text>
                <Divider marginY={2} />
                <Text fontSize="sm" alignSelf="end">
                  Help us improve!{" "}
                  <Link
                    href={discordInvites.feedback}
                    target="_blank"
                    color="blue.400"
                    data-umami-event="discord-feedback"
                  >
                    Tell us about your experience
                  </Link>
                  .
                </Text>
              </Flex>
            </>
          )}
        </Box>
      </ModalBody>
    </>
  );
};

const SubmitTranscriptModal = ({
  isOpen,
  onClose: closeModal,
  onSubmit,
  prRepo,
  submitReview,
}: Props) => {
  const router = useRouter();
  const handleClose = () => {
    submitReview.reset();
    closeModal();
    if (submitReview.status == "success") {
      // return to Account page
      router.push("/");
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        {submitReview.status == "idle" ? (
          <ConfirmSubmitModalContent
            onClose={handleClose}
            onSubmit={onSubmit}
            prRepo={prRepo}
          />
        ) : (
          <SubmitModalContent {...submitReview} />
        )}
      </ModalContent>
    </Modal>
  );
};

export default SubmitTranscriptModal;
