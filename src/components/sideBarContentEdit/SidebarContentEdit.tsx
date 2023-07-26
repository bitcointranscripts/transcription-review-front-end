/* eslint-disable no-unused-vars */
import { useGetRepoDirectories } from "@/services/api/transcripts/useGetDirectories";
import { useGetMetaData } from "@/services/api/transcripts/useGetMetaData";
import { getTimeLeftText } from "@/utils";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { AiFillFolder } from "react-icons/ai";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import {
  IDir,
  Review,
  SelectableMetaDataType,
  Transcript,
  TranscriptContent,
} from "../../../types";
import {
  sideBarContentUpdateParams,
  SideBarData,
  SidebarSubType,
} from "../transcript";
import { OnlySelectField, SingleSelectField } from "./SelectField";
import styles from "./sidebarContentEdit.module.css";
import TextField from "./TextField";
import SelectDirectory from "./SelectDirectory";

function findAndUpdateDir(objArray: IDir[], path: string, newDir: IDir[]) {
  const level = path.split("/").length;
  for (let obj of objArray) {
    // Check if the current object has the path
    if (obj.value === path.slice(0, -1)) {
      // Update the name of the target object
      obj.nestDir = newDir;
      return true; // Return true to indicate that the object was found and updated
    }
    // If the current object has nestDir, recursively call the function
    if (!obj.nestDir && level > 1) {
      const objectFound = findAndUpdateDir(obj.nestDir || [], path, newDir);
      if (objectFound) {
        return true; // Return true to indicate that the object was found and updated
      }
    }
  }

  return false; // Return false if the object was not found
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
  const [initialCount, setInitialCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const { data: selectableListData } = useGetMetaData();
  const { data: directoryPaths, isLoading:directoryIsLoading } = useGetRepoDirectories(path);
  const [directoryList, setDirectoryList] = useState<IDir[] | []>([]);
  useEffect(() => {
    // we want the rootpath to load first before
    if (directoryPaths && initialCount < 2) {
      setPath(`${data.content.loc ?? "misc"}`);
      setInitialCount(2);
    }
  }, [data.content.loc, directoryPaths, initialCount]);
  useEffect(() => {
    const convertDirStructure = (
      currentDirs: SelectableMetaDataType[],
      path: string,
      prev?: IDir[]
    ) => {
      const level = path.split("/").length; // based on the "/"
      let nestedDirFormat = prev || [];
      switch (level) {
        case 1:
          nestedDirFormat = currentDirs;
          break;
        default:
          findAndUpdateDir(nestedDirFormat || [], path, currentDirs);
          break;
      }
      return nestedDirFormat;
    };
    if (directoryPaths) {
      const tempDir = convertDirStructure(
        directoryPaths.dir,
        path,
        directoryList
      );
      setIsLoading((prev) => !prev);
      setDirectoryList(tempDir);
    }
  }, [directoryPaths, path]);
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
            isLoading={isLoading}
            isDirLoading={directoryIsLoading}
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

          {/* <CustomDatePicker date={editedDate} onChange={setEditedDate} /> */}
          <DatePicker
            selected={sideBarData.date.date}
            onChange={updateDate}
            dateFormat="yyyy-MM-dd"
            className={styles.customDatePicker}
          />

          {/* <Input
            fontSize="12px"
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
          /> */}
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
