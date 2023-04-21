import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { BiCheck, BiLink, BiX } from "react-icons/bi";

export type SubmitState = {
  stepIdx: number;
  steps: string[];
  isLoading: boolean;
  isError: boolean;
  isModalOpen: boolean;
  prResult: null | any;
  err: null | Error;
};

type Props = {
  submitState: SubmitState;
  onClose: () => void;
};

const SubmitTranscriptModal = ({ submitState, onClose }: Props) => {
  const { stepIdx, steps, isLoading, isError, isModalOpen, prResult, err } =
    submitState;
  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Submitting Transcript</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            {steps.map((step, idx) => {
              const stepLoading = stepIdx === idx && !isError;
              const stepCompleted = idx < stepIdx;
              const stepNotRun = idx > stepIdx;
              const stepError = stepIdx === idx && isError;
              return (
                <Flex key={step} alignItems="center" gap={2}>
                  {stepLoading && (
                    <Spinner color="orange.300" size="sm" thickness="2px" />
                  )}
                  {stepNotRun && (
                    <Box height="2px" width="14px" bgColor="gray.300"></Box>
                  )}
                  {stepCompleted && (
                    <Icon as={BiCheck} color="green.400" boxSize={6} />
                  )}
                  {stepError && <Icon as={BiX} color="red.400" boxSize={6} />}
                  {/* <Text>{stepIdx <= idx ? "Loading" : isError ? "Error" : "Completed"}</Text> */}
                  <Text
                    fontSize="16px"
                    color={
                      stepLoading
                        ? "orange.400"
                        : stepCompleted
                        ? "green.400"
                        : stepNotRun
                        ? "gray.300"
                        : "red.400"
                    }
                    fontWeight={stepNotRun ? 300 : 600}
                  >
                    {step}
                  </Text>
                </Flex>
              );
            })}
          </Box>
          <Box my={6}>
            {isError && !isLoading && (
              <Box>
                <Text color="gray.400" fontWeight={500}>
                  Unsucessful
                </Text>
                {err?.message && (
                  <>
                    <Divider mt={1} mb={3} />
                    <Text color="red.400" fontWeight={500}>
                      Error:
                    </Text>
                    <Text color="red.400">{err?.message}</Text>
                  </>
                )}
              </Box>
            )}
            {!isError && !isLoading && prResult?.data?.html_url && (
              <Flex gap={2} alignItems="center">
                <Text fontWeight={600}>Sucessfully opened a PR at:</Text>
                <Link href={prResult?.data?.html_url} target="_blank">
                  <Button
                    size="sm"
                    variant="unstyled"
                    _hover={{ color: "blue.500" }}
                  >
                    <Flex gap={2} alignItems="center">
                      <Icon as={BiLink} />
                      <Text>PR Link</Text>
                    </Flex>
                  </Button>
                </Link>
              </Flex>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SubmitTranscriptModal;
