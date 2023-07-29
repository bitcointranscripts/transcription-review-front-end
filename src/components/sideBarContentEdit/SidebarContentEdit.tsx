import { useGetMetaData } from "@/services/api/transcripts/useGetMetaData";
import { useGetRepoDirectories } from "@/services/api/transcripts/useGetRepoDirectories";
import { getTimeLeftText } from "@/utils";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import jsonData from "../../../public/static/directoryMetadata.json";
import { IDir, Review, Transcript, TranscriptContent } from "../../../types";
import {
  sideBarContentUpdateParams,
  SideBarData,
  SidebarSubType,
} from "../transcript";
import SelectDirectory from "./SelectDirectory";
import { OnlySelectField, SingleSelectField } from "./SelectField";
import styles from "./sidebarContentEdit.module.css";
import TextField from "./TextField";
import config from "@/config/config.json";

function extractDirFormat(input: Record<string, any> = {}): IDir[] {
  if (Object.keys(input).length === 0) return [];

  return Object.keys(input).map((key: string) => {
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

const SidebarContentEdit = ({
  data,
  claimedAt,
  children,
  sideBarData,
  updater,
  getUpdatedTranscript,
  saveTranscript,
}: {
  data: Transcript;
  claimedAt: Review["createdAt"];
  children?: ReactNode;
  sideBarData: SideBarData;
  updater: <T extends keyof SideBarData, K extends SidebarSubType<T>>({
    data,
    type,
    name,
  }: sideBarContentUpdateParams<T, K>) => void;
  getUpdatedTranscript: () => TranscriptContent;
  saveTranscript: (updatedContent: TranscriptContent) => Promise<void>;
}) => {
  const [path, setPath] = useState<string>("");
  const [initialCount, setInitialCount] = useState(1);
  const { data: selectableListData } = useGetMetaData();
  const [directoryList, setDirectoryList] = useState<IDir[] | []>([]);
  const updateTitle = (newTitle: string) => {
    const updatedTranscript = getUpdatedTranscript();
    updatedTranscript.title = newTitle;
    saveTranscript(updatedTranscript);

    updater({
      data: newTitle,
      type: "text",
      name: "title",
    });
  };

  const updateSpeaker = (speakers: string[]) => {
    const updatedTranscript = getUpdatedTranscript();
    updatedTranscript.speakers = speakers;
    saveTranscript(updatedTranscript);
    updater({
      data: speakers,
      type: "list",
      name: "speakers",
    });
  };

  useEffect(() => {
    // we want the rootpath to load first before
    if (initialCount < 2) {
      setPath(`${data.content.loc ?? config.defaultDirectoryPath}`);
      setInitialCount(2);
    }
  }, [data.content.loc, initialCount]);

  useEffect(() => {
    if (jsonData) {
      const directories = extractDirFormat(jsonData);
      setDirectoryList(directories);
    }
  }, []);

  const updateDate = (date: Date) => {
    const updatedTranscript = getUpdatedTranscript();
    updatedTranscript.date = date;
    saveTranscript(updatedTranscript);

    updater({ data: date, type: "date", name: "date" });
  };
  const updateDirectory = (dir: string) => {
    setPath(`${dir}`);
    const updatedTranscript = getUpdatedTranscript();
    updatedTranscript.loc = dir;
    saveTranscript(updatedTranscript);
    updater({
      data: dir,
      type: "loc",
      name: "loc",
    });
  };
  const updateCategories = (categories: string[]) => {
    const updatedTranscript = getUpdatedTranscript();
    updatedTranscript.categories = categories;
    saveTranscript(updatedTranscript);

    updater({
      data: categories,
      type: "list",
      name: "categories",
    });
  };
  const updateTags = (tags: string[]) => {
    const updatedTranscript = getUpdatedTranscript();
    updatedTranscript.tags = tags;
    saveTranscript(updatedTranscript);

    updater({
      data: tags,
      type: "list",
      name: "tags",
    });
  };
  return (
    <Box
      w="full"
      flex="1 1 30%"
      p={4}
      boxShadow="lg"
      borderRadius="lg"
      border="2px solid"
      borderColor="gray.200"
      fontSize="14px"
    >
      <Flex direction="column" gap={6}>
        <Box
          display="flex"
          gap={2}
          fontSize="16px"
          fontWeight={700}
          lineHeight={1}
          color="red.700"
          ml="auto"
        >
          <span>
            <MdOutlineAccessTimeFilled />
          </span>
          <span>{getTimeLeftText(claimedAt)}</span>
        </Box>
        <Box>
          <Text fontWeight={600} mb={2}>
            Original Media
          </Text>
          <Link href={data.content?.media || ""} target="_blank">
            <Button colorScheme="orange" size="sm">
              Source
            </Button>
          </Link>
        </Box>
        <Box>
          <Text fontWeight={600} mb={2}>
            Title
          </Text>
          <TextField
            data={data.content?.title ?? ""}
            editedData={sideBarData.text.title}
            updateData={updateTitle}
          />
        </Box>
        <Box>
          <Text fontWeight={600} mb={2}>
            Choose Directory
          </Text>
          <SelectDirectory
            path={path}
            setPath={setPath}
            options={directoryList}
            updateData={updateDirectory}
          />
        </Box>
        <Box>
          <Text fontWeight={600} mb={2}>
            Speakers
          </Text>
          <OnlySelectField
            name="speakers"
            editedData={sideBarData.list.speakers}
            updateData={updateSpeaker}
            autoCompleteList={selectableListData?.speakers ?? []}
            userCanAddToList
          />
        </Box>
        <Box>
          <Text display="inline-block" fontWeight={600} mb={2}>
            Date of Recording
          </Text>
          <Text ml={3} display="inline-block" color="gray.400">
            YYYY-MM-DD format
          </Text>

          <DatePicker
            selected={sideBarData.date.date}
            onChange={updateDate}
            dateFormat="yyyy-MM-dd"
            className={styles.customDatePicker}
          />
        </Box>
        <Box>
          <Text fontWeight={600} mb={2}>
            Categories
          </Text>
          <SingleSelectField
            name="category"
            editedData={sideBarData.list.categories}
            updateData={updateCategories}
            autoCompleteList={selectableListData?.categories ?? []}
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
          <OnlySelectField
            name="tags"
            editedData={sideBarData.list.tags}
            updateData={updateTags}
            autoCompleteList={selectableListData?.tags ?? []}
          />
        </Box>
        {children}
      </Flex>
    </Box>
  );
};

export default SidebarContentEdit;
