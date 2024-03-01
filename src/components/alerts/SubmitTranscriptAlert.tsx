import { TranscriptSubmitOptions } from "@/components/menus/SubmitTranscriptMenu";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { forwardRef, useRef } from "react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  prRepo: TranscriptSubmitOptions;
};

type PromptTwoProps = Omit<Props, "isOpen">;

type PromptOneProps = Omit<PromptTwoProps, "prRepo" | "onSubmit">;

const SubmitTranscriptAlert = ({
  isOpen,
  onCancel,
  onSubmit,
  prRepo,
}: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    onCancel();
  };

  return (
    <AlertDialog
      size={'xl'}
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <PromptStepOne onCancel={onCancel} ref={cancelRef} />
          <PromptStepTwo
            prRepo={prRepo}
            onSubmit={onSubmit}
            onCancel={handleClose}
            ref={cancelRef}
          />
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default SubmitTranscriptAlert;

const PromptStepOne = forwardRef<HTMLButtonElement, PromptOneProps>(
  ({ onCancel }, ref) => {
    return (
      <>
        <AlertDialogHeader fontSize="xl">
          Let&apos;s review your edits
        </AlertDialogHeader>
        <AlertDialogBody>
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
              chapters effectively, attributed speakers accurately, and
              conducted a final coherence check to ensure the transcript
              is not only accurate but also readable.
            </Text>
            <Button size="sm" mx="auto" ref={ref} onClick={onCancel}>
              Let me check a few things
            </Button>
          </Flex>
        </AlertDialogBody>
      </>
    );
  }
);

PromptStepOne.displayName = "PromptStepOne";

const PromptStepTwo = forwardRef<HTMLButtonElement, PromptTwoProps>(
  ({ onCancel, prRepo, onSubmit }, ref) => {
    return (
      <>
        <AlertDialogBody>
          By hitting submit, this would create a PR on{" "}
          <b>
            {prRepo === "btc transcript"
              ? "the Bitcoin Transcript repo"
              : "your repo"}
          </b>{" "}
        </AlertDialogBody>
        <AlertDialogFooter gap={3}>
          <Button
            ref={ref}
            display="block"
            size="sm"
            mx="auto"
            colorScheme="blue"
            onClick={() => {
              onCancel();
              onSubmit();
            }}
          >
            Ready to ship! <span>🚢</span>
          </Button>
        </AlertDialogFooter>
      </>
    );
  }
);
PromptStepTwo.displayName = "PromptStepTwo";
