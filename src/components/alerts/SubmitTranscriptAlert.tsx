import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

import { useRef } from "react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const SubmitTranscriptAlert = ({ isOpen, onCancel, onSubmit }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onCancel}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Submit Review?
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to submit your review, this would create a PR
            on the <b>Bitcoin Transcript</b> Repo
          </AlertDialogBody>
          <AlertDialogFooter gap={3}>
            <Button
              size="sm"
              colorScheme="orange"
              variant={"outline"}
              ref={cancelRef}
              onClick={onCancel}
            >
              Cancel
            </Button>
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
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default SubmitTranscriptAlert;
