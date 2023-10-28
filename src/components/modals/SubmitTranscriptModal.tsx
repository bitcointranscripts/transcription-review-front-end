import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import NextLink from "next/link";
import { BiCheck, BiX } from "react-icons/bi";

export type SubmitState = {
  stepIdx: number;
  steps: string[];
  isLoading: boolean;
  isError: boolean;
  isModalOpen: boolean;
  prResult: null | any;
  err: null | AxiosError<{ message: string }>;
};

type Props = {
  submitState: SubmitState;
  onClose: () => void;
};

const SubmitTranscriptModal = ({ submitState, onClose }: Props) => {
  const { stepIdx, steps, isLoading, isError, isModalOpen, prResult, err } =
    submitState;
  const errorMessage = err?.response?.data?.message || err?.message;
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
          <Box my={4}>
            {isError && !isLoading && (
              <Box>
                <Text color="gray.400" fontWeight={500}>
                  Unsuccessful
                </Text>
                {err?.message && (
                  <>
                    <Divider mt={1} mb={3} />
                    <Text color="red.400" fontWeight={500}>
                      Error:
                    </Text>
                    <Text color="red.400">{errorMessage}</Text>
                  </>
                )}
              </Box>
            )}
            {!isError && !isLoading && prResult?.data?.html_url && (
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
                    Corrections and conversations about this transcript will
                    shift to GitHub on your PR linked
                    <span> </span>
                    <Link
                      as={NextLink}
                      href={prResult?.data?.html_url}
                      target="_blank"
                      color="blue.400"
                    >
                      here
                    </Link>
                    .
                  </Text>
                </Flex>
              </>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SubmitTranscriptModal;
