import { useState } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { useHasPermission } from "@/hooks/useHasPermissions";
import AuthStatus from "@/components/transcript/AuthStatus";
import {
  useTranscriptionQueue,
  useTranscriptionBacklog,
} from "@/services/api/admin";
import { SelectSourceMenu } from "@/components/tables/components";

import BaseTable from "@/components/tables/BaseTable";
import { convertStringToArray } from "@/utils";
import TitleWithTags from "@/components/tables/TitleWithTags";
import { TableStructure } from "@/components/tables/types";
import { TranscriptMetadata, TranscriptionQueueItem } from "../../../types";

const Sources = () => {
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [removeFromQueueSelection, setRemoveFromQueueSelection] = useState<
    string[]
  >([]);
  const [addToQueueSelection, setAddToQueueSelection] = useState<string[]>([]);
  const canAccessTranscription = useHasPermission("accessTranscription");

  const { transcriptionBacklog, sources } =
    useTranscriptionBacklog(selectedSource);
  const {
    transcriptionQueue,
    remainingBacklog,
    addToQueue,
    removeFromQueue,
    startTranscription,
    isTranscribing,
    refetch,
  } = useTranscriptionQueue(transcriptionBacklog.data);

  const handleAddToQueue = async () => {
    await addToQueue.mutateAsync(addToQueueSelection);
    setAddToQueueSelection([]);
  };

  const handleRemoveFromQueue = async () => {
    await removeFromQueue.mutateAsync(removeFromQueueSelection);
    setRemoveFromQueueSelection([]);
  };

  const tableStructure = [
    {
      name: "Title",
      type: "default",
      modifier: () => null,
      component: (data) => {
        const allTags = convertStringToArray(data.tags);
        return (
          <TitleWithTags
            title={data.title}
            allTags={allTags}
            categories={[]}
            loc={data.loc}
            url={data.media}
            id={0}
            length={allTags.length}
            shouldSlice={false}
          />
        );
      },
    },
    {
      name: "speakers",
      type: "text-long",
      modifier: (data) => data.speakers.join(", "),
    },
    { name: "Publish Date", type: "text-short", modifier: (data) => data.date },
  ] satisfies TableStructure<TranscriptMetadata>[];

  const transcriptionQueueTableStructure = [
    ...tableStructure,
    {
      name: "status",
      type: "text-short",
      modifier: (data) => data.status,
    },
  ] satisfies TableStructure<TranscriptionQueueItem>[];

  if (!canAccessTranscription) {
    return (
      <AuthStatus
        title="Unauthorized"
        message="You are not authorized to access this page"
      />
    );
  }

  return (
    <>
      <Flex flexDir="column">
        <Heading size={"md"} mb={10}>
          {`Transcription Management`}
        </Heading>
        <BaseTable
          data={transcriptionQueue.data}
          emptyView={
            <Flex w="full" justifyContent="center" alignItems="center" gap={2}>
              <Text>Transcription queue is empty</Text>
            </Flex>
          }
          isLoading={transcriptionQueue.isLoading}
          isError={transcriptionQueue.isError}
          tableStructure={transcriptionQueueTableStructure}
          tableHeaderComponent={
            <Heading size="sm" mb={1}>
              Transcription Queue
            </Heading>
          }
          enableCheckboxes={!isTranscribing}
          selectedRowIds={removeFromQueueSelection}
          onSelectedRowIdsChange={setRemoveFromQueueSelection}
          getRowId={(row) => row.media}
          refetch={refetch}
          actionItems={
            <>
              {!isTranscribing && (
                <Button
                  isDisabled={removeFromQueueSelection.length == 0}
                  isLoading={removeFromQueue.isLoading}
                  onClick={handleRemoveFromQueue}
                >
                  Remove from Queue
                </Button>
              )}
              <Button
                isDisabled={
                  transcriptionBacklog.isLoading ||
                  transcriptionQueue.data?.length == 0 ||
                  isTranscribing
                }
                onClick={() => startTranscription.mutate()}
              >
                {`${
                  isTranscribing
                    ? "Transcription in Progress..."
                    : "Start Transcription"
                }`}
              </Button>
            </>
          }
        />
        <BaseTable
          data={remainingBacklog}
          emptyView={
            <Flex w="full" justifyContent="center" alignItems="center" gap={2}>
              <Text>
                Transcription backlog is empty for the selected source
              </Text>
            </Flex>
          }
          isLoading={transcriptionBacklog.isLoading}
          isError={transcriptionBacklog.isError}
          tableStructure={tableStructure}
          tableHeaderComponent={
            <Heading size="sm" mb={1}>
              {`Transcription Backlog (${selectedSource})`}
            </Heading>
          }
          enableCheckboxes
          selectedRowIds={addToQueueSelection}
          onSelectedRowIdsChange={setAddToQueueSelection}
          getRowId={(row) => row.media}
          actionItems={
            <>
              <Button
                isLoading={addToQueue.isLoading}
                isDisabled={addToQueueSelection.length == 0}
                onClick={handleAddToQueue}
              >
                Add to Queue
              </Button>
              <SelectSourceMenu
                sources={sources.data}
                isLoading={sources.isLoading}
                onSelection={(source: string) => setSelectedSource(source)}
              />
            </>
          }
        />
      </Flex>
    </>
  );
};

export default Sources;
