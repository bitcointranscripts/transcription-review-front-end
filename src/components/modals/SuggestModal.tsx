import config from "@/config/config.json";
import { useCreatePR } from "@/services/api/github";
import { useGetMetadata } from "@/services/api/transcripts/useGetMetadata";
import { compareUrls, getPRRepo } from "@/utils";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { type FocusEventHandler, type FormEvent, useState } from "react";
import { OnlySelectField } from "../sideBarContentEdit/SelectField";

type SuggestModalProps = {
  handleClose: () => void;
  isOpen: boolean;
};

type FormValues = {
  speakers: string[];
  tags: string[];
  title: string;
  url: string;
};

const defaultFormValues = {
  speakers: [],
  tags: [],
  title: "",
  url: "",
} satisfies FormValues;

export function SuggestModal({ handleClose, isOpen }: SuggestModalProps) {
  const toast = useToast();
  const createPR = useCreatePR();
  const [urlError, setUrlError] = useState("");
  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);
  const { data: selectableListData } = useGetMetadata();

  const resetAndCloseForm = () => {
    setFormValues(defaultFormValues);
    setUrlError("");
    handleClose();
  };

  const validateUrl: FocusEventHandler<HTMLInputElement> = (e) => {
    try {
      const value = e.target.value.trim();

      if (!value) {
        setUrlError("");
        return;
      }

      const url = new URL(value);
      const hasCorrectProtocol = ["https:", "http:"].some((v) =>
        v.includes(url.protocol)
      );

      if (!hasCorrectProtocol) {
        setUrlError(
          "Please include the correct protocol in the URL (http:// or https://)"
        );
        return;
      }

      const urlExists = selectableListData?.media.some((mediaUrl) =>
        compareUrls(new URL(mediaUrl), url)
      );

      if (urlExists) {
        setUrlError("A transcript for this source already exists");
        return;
      }

      setUrlError("");
      setFormValues((v) => ({ ...v, url: value }));
    } catch {
      setUrlError("Invalid URL, please enter a valid URL");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createPR.mutate(
      {
        directoryPath: config.defaultDirectoryPath,
        fileName: formValues.title,
        url: formValues.url,
        transcribedText: "",
        prRepo: getPRRepo(),
        tags: formValues.tags,
        speakers: formValues.speakers,
        needs: "transcript",
      },
      {
        onError: (e) => {
          const description =
            e instanceof Error
              ? e.message
              : "An error occurred while submitting suggestion";
          toast({
            status: "error",
            title: "Error submitting",
            description,
          });
        },
        onSuccess: () => {
          toast({
            status: "success",
            title: "Suggestion submitted successfully",
            onCloseComplete: resetAndCloseForm,
          });
        },
      }
    );
  };

  const formIsComplete =
    !!(formValues.title.trim() && formValues.url.trim()) && !urlError;

  return (
    <Modal isOpen={isOpen} onClose={resetAndCloseForm}>
      <ModalOverlay />
      <ModalContent
        mx={{ base: "16px", lg: "0px" }}
        maxW={{ base: "400px", lg: "580px" }}
        maxH="80vh"
        overflow="scroll"
        borderRadius={20}
      >
        <Flex p={10} flexDir="column">
          <ModalHeader p={0} mb={{ base: "24px", lg: "36px" }}>
            <Text
              fontSize={{ base: "md", lg: "xl" }}
              mb={{ base: "4px", lg: "8px" }}
              textAlign="center"
            >
              Help Expand Our Source Library
            </Text>
            <Text
              fontWeight="600"
              fontSize={{ base: "sm", lg: "md" }}
              textAlign="center"
            >
              We manually review every suggestion to ensure it meets our
              standards for reliable, technical Bitcoin content.
            </Text>
          </ModalHeader>
          <ModalBody p={0}>
            <form onSubmit={handleSubmit}>
              <Flex flexDir="column" gap={{ base: "24px", lg: "32px" }}>
                <FormControl gap={{ base: "6px", lg: "xs" }}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    placeholder="Add transcript title"
                    onChange={(e) =>
                      setFormValues((v) => ({ ...v, title: e.target.value }))
                    }
                    required
                  />
                </FormControl>
                <FormControl gap={{ base: "6px", lg: "xs" }}>
                  <FormLabel>Source&apos;s URL</FormLabel>
                  <Input
                    type="url"
                    placeholder="https://"
                    onBlur={validateUrl}
                    required
                    maxLength={255}
                  />
                  {!urlError && !!formValues.url && (
                    <FormHelperText
                      fontSize={{ base: "xs", lg: "sm" }}
                      color={urlError ? "red" : undefined}
                      fontWeight="medium"
                    >
                      {urlError
                        ? urlError
                        : "Please enter the full URL, including http:// or https://"}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl gap={{ base: "6px", lg: "xs" }}>
                  <FormLabel>Tags</FormLabel>
                  <OnlySelectField
                    name="tags"
                    editedData={formValues.tags}
                    updateData={(tags) =>
                      setFormValues((v) => ({
                        ...v,
                        tags,
                      }))
                    }
                    autoCompleteList={selectableListData?.tags ?? []}
                    userCanAddToList
                  />
                </FormControl>
                <FormControl gap={{ base: "6px", lg: "xs" }}>
                  <FormLabel>Speakers</FormLabel>
                  <OnlySelectField
                    name="speakers"
                    editedData={formValues.speakers}
                    updateData={(speakers) =>
                      setFormValues((v) => ({
                        ...v,
                        speakers,
                      }))
                    }
                    autoCompleteList={selectableListData?.speakers ?? []}
                    userCanAddToList
                  />
                </FormControl>
                <Flex gap={{ base: "8px", lg: "md" }}>
                  <Button
                    w="full"
                    py={3}
                    mx="auto"
                    rounded="10px"
                    isDisabled={createPR.isLoading}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    w="full"
                    isLoading={createPR.isLoading}
                    py={3}
                    mx="auto"
                    colorScheme="orange"
                    rounded="10px"
                    isDisabled={!formIsComplete}
                    type="submit"
                  >
                    Suggest Source
                  </Button>
                </Flex>
              </Flex>
            </form>
          </ModalBody>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
