import { guidelinesReviewArray } from "@/utils";
import {
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
        <ModalHeader px={5} fontSize="lg" fontWeight="bold">
          Review Guidelines
        </ModalHeader>
        <ModalBody p={0}>
          <Text fontSize={"sm"} px={5} pb={2}>
            To ensure a shared quality of transcripts, please review and make
            sure you meet the following guidelines:
          </Text>
          {guidelinesReviewArray.map((guideline) => (
            <Flex
              key={guideline.heading}
              my={2}
              flexDir={"column"}
              px={5}
              gap={2}
            >
              <Text>{guideline.heading}</Text>
              <UnorderedList pl={3} color="gray.700" fontSize="14px">
                {guideline.paragraphs.map((paragraph) => (
                  <ListItem key={paragraph}>
                    <Text>{paragraph}</Text>
                  </ListItem>
                ))}
              </UnorderedList>
            </Flex>
          ))}

          {isFirstTime && (
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
          )}
        </ModalBody>
      </>
    );
  }
);

GuidelinesContent.displayName = "GuidelinesContent";
