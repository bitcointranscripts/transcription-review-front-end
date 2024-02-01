import { guidelinesReviewArray } from "@/utils";
import {
  Button,
  Flex,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { forwardRef, useRef } from "react";

type Props = {
  isOpen: boolean;
  isFirstTime?: boolean;
  onCancel: () => void;
};

type GuidelinesContentProps = Omit<Props, "isOpen">;

const ReviewGuidelinesAlert = ({ isOpen, onCancel }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const isFirstTime = router.query.first_review === "true" ? true : false;
  const handleClose = () => {
    onCancel();
    router.query.first_review = "false";
  };

  return (
    <Modal
      size={"2xl"}
      isOpen={isOpen}
      onClose={!isFirstTime ? handleClose : () => {}}
      autoFocus={false}
    >
      <ModalOverlay>
        <ModalContent
          maxH={"80vh"}
          p={0}
          position={"relative"}
          overflowY={"auto"}
        >
          <GuidelinesContent
            onCancel={handleClose}
            ref={cancelRef}
            isFirstTime={isFirstTime}
          />
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ReviewGuidelinesAlert;

const GuidelinesContent = forwardRef<HTMLButtonElement, GuidelinesContentProps>(
  ({ onCancel, isFirstTime }, ref) => {
    return (
      <>
        <ModalHeader fontSize="2xl" fontWeight="bold">
          Review Guidelines
        </ModalHeader>
        <ModalBody>
          <Flex
            flexDir={"column"}
            gap={2}
          >
            <Text>
              To ensure a shared quality of transcripts, please
              follow the guidelines below
            </Text>
            {guidelinesReviewArray.map((guideline) => (
              <Flex
                key={guideline.heading}
                flexDir={"column"}
                gap={2}
              >
                <Text fontWeight="bold">{guideline.heading}</Text>
                <UnorderedList pl={3} color="gray.700" fontSize="14px">
                  {guideline.paragraphs.map((paragraph) => (
                    <ListItem key={paragraph}>
                      <Text>{paragraph}</Text>
                    </ListItem>
                  ))}
                </UnorderedList>

              </Flex>
            ))}
          </Flex>
        </ModalBody>

        {isFirstTime && (
          <ModalFooter
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
          </ModalFooter>
        )}

      </>
    );
  }
);

GuidelinesContent.displayName = "GuidelinesContent";
