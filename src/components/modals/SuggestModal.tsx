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
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { type FormEvent, useState, ChangeEvent } from "react";

type SuggestModalProps = {
  handleClose: () => void;
  isOpen: boolean;
};

type FormValues = {
  title: string;
  url: string;
};

const defaultFormValues = {
  title: "",
  url: "",
} satisfies FormValues;

const SuggestModal = ({ handleClose, isOpen }: SuggestModalProps) => {
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

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({ ...v, url: e.target.value }));
    setUrlError("");
  };

  const validateUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString.trim());

      const urlExists = selectableListData?.media.some((mediaUrl) =>
        compareUrls(new URL(mediaUrl), url)
      );

      if (urlExists) {
        // TODO: Add a link to the existing transcript if a source exists.
        // This would help users who want to add a source by pointing them to the existing transcript.
        // Modifications to <https://btctranscripts.com/status.json> are needed to make the transcript URL accessible.
        setUrlError("A transcript for this source already exists");
        return false;
      }

      return true;
    } catch {
      setUrlError("Invalid URL, please enter a valid URL");
      return false;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const isUrlValid = validateUrl(formValues.url);
    if (!isUrlValid) return;

    createPR.mutate(
      {
        directoryPath: config.defaultDirectoryPath,
        fileName: formValues.title,
        url: formValues.url,
        transcribedText: "",
        prRepo: getPRRepo(),
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
          });
          resetAndCloseForm();
        },
      }
    );
  };

  const formIsComplete = !!(formValues.title.trim() && formValues.url.trim());

  return (
    <Modal isOpen={isOpen} onClose={resetAndCloseForm} isCentered>
      <ModalOverlay />
      <ModalContent
        mx={{ base: "16px", lg: "0px" }}
        maxW={{ base: "400px", lg: "580px" }}
        maxH="80vh"
        overflowY={"auto"}
        borderRadius={20}
      >
        <ModalHeader>
          <Text
            fontSize={{ base: "md", lg: "xl" }}
            mb={{ base: "4px", lg: "8px" }}
            textAlign="center"
          >
            Suggest a Source for Transcription
          </Text>
          <Text
            fontWeight="600"
            fontSize={{ base: "xs", lg: "sm" }}
            textAlign="center"
          >
            We manually review every suggestion to ensure it meets our standards
            for reliable, technical Bitcoin content.
          </Text>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Flex flexDir="column" gap={{ base: "24px", lg: "32px" }}>
              <FormControl isRequired gap={{ base: "6px", lg: "xs" }}>
                <FormLabel>Title</FormLabel>
                <Input
                  placeholder="Add transcript title"
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, title: e.target.value }))
                  }
                  required
                />
              </FormControl>
              <FormControl
                isRequired
                gap={{ base: "6px", lg: "xs" }}
                isInvalid={!!urlError}
              >
                <FormLabel>Source&apos;s URL</FormLabel>
                <Input
                  type="url"
                  placeholder="https://"
                  onChange={handleUrlChange}
                  required
                  maxLength={255}
                />
                <FormHelperText
                  fontSize={{ base: "xs", lg: "sm" }}
                  color={urlError ? "red" : undefined}
                  fontWeight="medium"
                >
                  {urlError
                    ? urlError
                    : "Please enter the full URL, including http:// or https://"}
                </FormHelperText>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter gap={{ base: "8px", lg: "md" }} w="full">
            <Button
              w="full"
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
              mx="auto"
              colorScheme="orange"
              rounded="10px"
              isDisabled={!formIsComplete}
              type="submit"
            >
              Suggest source
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default SuggestModal;
