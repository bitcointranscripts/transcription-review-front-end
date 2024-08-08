import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./datePicker.module.css";
import { FaBook } from "react-icons/fa";
//@ts-ignore
import { SlateTranscriptEditor } from "slate-transcript-editor";

import {
  ReviewGuidelinesModal,
  SubmitTranscriptModal,
  RestoreOriginalModal,
  SelectSpeakerModal,
} from "@/components/modals";
import { useGetMetadata } from "@/services/api/transcripts/useGetMetadata";
import SubmitTranscriptMenu, {
  TranscriptSubmitOptions,
} from "@/components/menus/SubmitTranscriptMenu";
import { compareTranscriptBetweenSave } from "@/utils/transcript";
import { getPRRepo } from "@/utils";
import { useHasPermission } from "@/hooks/useHasPermissions";
import { useGithub } from "@/services/api/github";

import type {
  SlateNode,
  TranscriptMetadata,
  TranscriptReview,
} from "../../../types";
import { SelectField } from "../sideBarContentEdit/SelectField";
import TextField from "../sideBarContentEdit/TextField";
import { StatusLabel } from "./components";

const TranscriptEditor = ({ reviewData }: { reviewData: TranscriptReview }) => {
  const router = useRouter();
  const { data: allMetadata } = useGetMetadata();
  const { saveProgress, submitReview } = useGithub();
  const [title, setTitle] = useState(reviewData.transcript.metadata.title);
  const [tags, setTags] = useState(reviewData.transcript.metadata.tags);
  const [date, setDate] = useState(
    new Date(reviewData.transcript.metadata.date)
  );
  const [isContentModified, setIsContentIsModified] = useState(false);
  const [prRepo, setPrRepo] = useState<TranscriptSubmitOptions>(getPRRepo());

  const {
    isOpen: restoreModalIsOpen,
    onOpen: openRestoreModal,
    onClose: closeRestoreModal,
  } = useDisclosure();
  const {
    isOpen: submitModalIsOpen,
    onOpen: openSubmitModal,
    onClose: closeSubmitModal,
  } = useDisclosure();
  const {
    isOpen: guidelinesIsOpen,
    onOpen: openGuidelines,
    onClose: closeGuidelines,
  } = useDisclosure({ defaultIsOpen: router.query?.first_review === "true" });

  const canSubmitToOwnRepo = useHasPermission("submitToOwnRepo");
  const reviewSubmissionDisabled =
    !!reviewData.branchUrl && !!reviewData.pr_url;

  const metadata: TranscriptMetadata = useMemo(() => {
    return {
      ...reviewData.transcript.metadata,
      title,
      tags,
      date,
    };
  }, [reviewData.transcript.metadata, title, tags, date]);

  const saveTranscript = async (edits: SlateNode[], speakers: string[]) => {
    // Compare between saves to avoid empty commits
    const isPreviousHash = compareTranscriptBetweenSave({
      transcriptSlate: edits,
      metadata: {
        ...metadata,
        speakers,
      },
    });
    if (isPreviousHash) {
      return;
    }

    await saveProgress.mutateAsync({
      transcriptSlate: edits,
      transcriptUrl: reviewData.transcript.url,
      branchUrl: reviewData.branchUrl,
      metadata: {
        ...metadata,
        speakers,
      },
    });
    setIsContentIsModified(false);
  };

  const updateTitle = (title: string) => {
    setTitle(title);
    setIsContentIsModified(true);
  };

  const updateTags = (tags: string[]) => {
    const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
    setTags(lowerCaseTags);
    setIsContentIsModified(true);
  };

  const updateDate = (date: Date) => {
    setDate(date);
    setIsContentIsModified(true);
  };

  const restoreOriginalContent = () => {
    // TODO: implement logic to restore original content
    closeRestoreModal();
  };

  const handleSubmit = async () => {
    if (reviewData?.pr_url) {
      // Users cannot re-submit
      // If there is already a Pull Request for this submission,
      // then it is automatically updated every time the user saves
      // their edits because every save is a new commit on the PR.
      // TODO: programamtically request a new review from the evaluator
    }
    // TODO: save before submit
    submitReview.mutateAsync({
      reviewId: reviewData.id,
      targetRepository: prRepo,
      transcriptUrl: reviewData.transcript.url,
      branchUrl: reviewData.branchUrl,
      metadata,
    });
  };

  return (
    <>
      <Flex w="full" flexDir="column">
        <Flex
          my={2}
          flexWrap={"wrap"}
          rowGap={4}
          justifyContent={"space-between"}
        >
          <Flex gap={2}>
            <Button
              colorScheme="orange"
              onClick={openGuidelines}
              size="xs"
              ml="auto"
              display="flex"
              gap={"4px"}
              variant="solid"
            >
              <FaBook /> Review Guidelines
            </Button>
            <Button
              colorScheme="gray"
              onClick={openRestoreModal}
              size="xs"
              ml="auto"
              display="block"
              variant="outline"
            >
              Restore Original
            </Button>
          </Flex>

          <Flex gap={2} alignItems={"center"}>
            <StatusLabel {...reviewData} />
            <Flex overflow="hidden" borderRadius="md" dir="row">
              <Tooltip
                label={
                  reviewSubmissionDisabled
                    ? "You cannot resubmit a submitted review, instead use save to update your submission"
                    : undefined
                }
              >
                <Button
                  borderRadius="none"
                  size="sm"
                  colorScheme="orange"
                  onClick={openSubmitModal}
                  isDisabled={reviewSubmissionDisabled}
                >
                  Submit {canSubmitToOwnRepo ? `(${prRepo})` : ""}
                </Button>
              </Tooltip>
              {canSubmitToOwnRepo && (
                <>
                  <SubmitTranscriptMenu setPrRepo={setPrRepo} />
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
        <SlateTranscriptEditor
          transcriptData={reviewData.transcript.dpe}
          mediaUrl={reviewData.transcript.metadata.source_file}
          handleSaveEditor={saveTranscript}
          autoSaveContentType={"slate"}
          buttonConfig={{ export: false, musicNote: false, replaceText: false }}
          SelectSpeakerModalComponent={SelectSpeakerModal}
          isDirty={isContentModified}
        >
          <Flex paddingTop={5} direction="column" gap={6}>
            <Box>
              <Text fontWeight={600} mb={2}>
                Title
              </Text>
              <TextField editedData={title} updateData={updateTitle} />
            </Box>
            <Box>
              <Text display="inline-block" fontWeight={600} mb={2}>
                Date of Recording
              </Text>
              <Text ml={3} display="inline-block" color="gray.400">
                YYYY-MM-DD format
              </Text>

              <DatePicker
                selected={date}
                onChange={updateDate}
                dateFormat="yyyy-MM-dd"
                className={styles.customDatePicker}
              />
            </Box>
            <Box>
              <Flex gap={2}>
                <Text fontWeight={600} mb={2}>
                  Tags
                </Text>
                <span>
                  (
                  <Link href="https://btctranscripts.com/tags/" target="_blank">
                    <Text display="inline" color="blue.600" fontSize="12px">
                      What&apos;s this?
                    </Text>
                  </Link>
                  )
                </span>
              </Flex>
              <SelectField
                name="tags"
                editedData={tags}
                updateData={updateTags}
                autoCompleteList={allMetadata?.tags ?? []}
                horizontal
              />
            </Box>
          </Flex>
        </SlateTranscriptEditor>
      </Flex>
      <SubmitTranscriptModal
        onSubmit={handleSubmit}
        submitReview={submitReview}
        isOpen={submitModalIsOpen}
        onClose={closeSubmitModal}
        prRepo={prRepo}
      />
      <ReviewGuidelinesModal
        isOpen={guidelinesIsOpen}
        onCancel={closeGuidelines}
      />
      <RestoreOriginalModal
        isOpen={restoreModalIsOpen}
        onClose={closeRestoreModal}
        onClick={restoreOriginalContent}
      />
    </>
  );
};

export default TranscriptEditor;
