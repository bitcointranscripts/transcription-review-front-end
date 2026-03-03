import config from "@/config/config.json";
import SelectDirectory from "@/components/sideBarContentEdit/SelectDirectory";
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
  Link,
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
import directoryMetadata from "../../../public/static/directoryMetadata.json";
import { IDir } from "../../../types";

type SuggestModalProps = {
  handleClose: () => void;
  isOpen: boolean;
};

function extractDirFormat(input: Record<string, any> = {}): IDir[] {
  if (Object.keys(input).length === 0) return [];
  return Object.keys(input).map((key) => {
    const child = input[key];
    return {
      slug: key,
      value: key,
      nestDir: Object.keys(child).map((ck: string) => ({
        value: ck,
        slug: `${key}/${ck}`,
        nestDir: extractDirFormat(child[ck]),
      })),
    };
  });
}

const directoryOptions = extractDirFormat(directoryMetadata);

type FormValues = {
  title: string;
  url: string;
  directory: string;
};

const defaultFormValues = {
  title: "",
  url: "",
  directory: config.defaultDirectoryPath,
} satisfies FormValues;

export function SuggestModal({ handleClose, isOpen }: SuggestModalProps) {
  const toast = useToast();
  const createPR = useCreatePR();
  const [urlError, setUrlError] = useState("");
  const [transcriptLink, setTranscriptLink] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);
  const [navPath, setNavPath] = useState(config.defaultDirectoryPath);
  const { data: selectableListData } = useGetMetadata();

  const resetAndCloseForm = () => {
    setFormValues(defaultFormValues);
    setUrlError("");
    setTranscriptLink(null);
    setNavPath(config.defaultDirectoryPath);
    handleClose();
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({ ...v, url: e.target.value }));
    setUrlError("");
    setTranscriptLink(null);
  }

  const validateUrl = (urlString: string): boolean => {
    try {

      const url = new URL(urlString.trim());

      const urlExists = selectableListData?.media.some((mediaUrl) =>
        compareUrls(new URL(mediaUrl), url)
      );

      if (urlExists) {
        // When status.json exposes a mediaUrl->transcriptUrl mapping, replace
        // config.btctranscripts_base_url with the direct transcript URL here.
        setTranscriptLink(config.btctranscripts_base_url);
        setUrlError("A transcript for this source already exists.");
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
        directoryPath: formValues.directory,
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
          resetAndCloseForm()
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
            We manually review every suggestion to ensure it meets our
            standards for reliable,
            technical Bitcoin content.
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
              <FormControl gap={{ base: "6px", lg: "xs" }}>
                <FormLabel>Directory</FormLabel>
                <SelectDirectory
                  path={navPath}
                  setPath={setNavPath}
                  options={directoryOptions}
                  displayValue={formValues.directory}
                  updateData={(val) =>
                    setFormValues((v) => ({ ...v, directory: val }))
                  }
                />
                <FormHelperText
                  fontSize={{ base: "xs", lg: "sm" }}
                  fontWeight="medium"
                >
                  Select an existing folder or type a custom path
                </FormHelperText>
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
                  {urlError ? (
                    <>
                      {urlError}{" "}
                      {transcriptLink && (
                        <Link
                          href={transcriptLink}
                          isExternal
                          textDecoration="underline"
                          whiteSpace="nowrap"
                        >
                          View on btctranscripts.com
                        </Link>
                      )}
                    </>
                  ) : (
                    "Please enter the full URL, including http:// or https://"
                  )}
                </FormHelperText>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter
            gap={{ base: "8px", lg: "md" }}
            w="full"
          >
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
}
