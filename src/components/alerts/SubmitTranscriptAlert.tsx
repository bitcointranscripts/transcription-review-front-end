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
import Link from "next/link";
import { forwardRef, useRef } from "react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  prRepo: TranscriptSubmitOptions;
};

type PromptTwoProps = {} & Omit<Props, "isOpen">;

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
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
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
              <Text>Author(s)</Text>
            </ListItem>
            <ListItem>
              <Text>Corrected speaker names in case of multiple speakers</Text>
            </ListItem>
            <ListItem>
              <Text>Date of original presentation</Text>
            </ListItem>
            <ListItem>
              <Text>
                Categories (for example, conference, meetup, and the like)
              </Text>
            </ListItem>
            <ListItem>
              <Text>Tags (that is, main topics)</Text>
            </ListItem>
            <ListItem>
              <Text>
                Sections (blocks of conversation that are grouped by a theme)
              </Text>
            </ListItem>
            <ListItem>
              <Text>Grammar and spelling (especially technical concepts)</Text>
            </ListItem>
            <ListItem>
              <Text>Used markdown</Text>
            </ListItem>
          </UnorderedList>
          <Flex my={4} direction="column" gap={3}>
            <Button size="sm" mx="auto" ref={ref} onClick={onCancel}>
              Let me check a few things.
            </Button>
            <Link href="/tutorial">
              <Button size="sm" mx="auto" display="block">
                View tutorial
              </Button>
            </Link>
            {/* Pr */}
          </Flex>
        </AlertDialogBody>
      </>
    );
  }
);

PromptStepOne.displayName = "PromptStepOne";

const PromptStepTwo = forwardRef<HTMLButtonElement, PromptTwoProps>(
  ({ onCancel, prRepo, onSubmit }) => {
    return (
      <>
        <AlertDialogBody>
          {/* Are you sure you want to submit your review? This would create a PR on{" "} */}
          By hitting submit, this would create a PR on{" "}
          <b>
            {prRepo === "btc transcript"
              ? "the Bitcoin Transcript repo"
              : "your repo"}
          </b>{" "}
        </AlertDialogBody>
        <AlertDialogFooter gap={3}>
          <Button
            size="sm"
            colorScheme="orange"
            onClick={() => {
              onCancel();
              onSubmit();
            }}
          >
            Submit
          </Button>
        </AlertDialogFooter>
      </>
    );
  }
);
PromptStepTwo.displayName = "PromptStepTwo";
