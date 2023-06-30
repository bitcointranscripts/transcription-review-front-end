/* eslint-disable no-unused-vars */
import { useGetMetaData } from "@/services/api/transcripts/useGetMetaData";
import { getTimeLeftText } from "@/utils";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { Review, Transcript } from "../../../types";
import {
  sideBarContentUpdateParams,
  SideBarData,
  SidebarSubType,
} from "../transcript";
import { OnlySelectField, SingleSelectField } from "./SelectField";
import styles from "./sidebarContentEdit.module.css";
import TextField from "./TextField";

const SidebarContentEdit = ({
  data,
  claimedAt,
  children,
  sideBarData,
  updater,
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
}) => {
  const { data: selectableListData, isLoading, error } = useGetMetaData();
  const updateTitle = (newTitle: string) => {
    updater({
      data: newTitle,
      type: "text",
      name: "title",
    });
  };
  const updateSpeaker = (speakers: string[]) => {
    updater({
      data: speakers,
      type: "list",
      name: "speakers",
    });
  };
  const updateCategories = (categories: string[]) => {
    updater({
      data: categories,
      type: "list",
      name: "categories",
    });
  };
  const updateTags = (tags: string[]) => {
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
            Date
          </Text>
          <Text ml={3} display="inline-block" color="gray.400">
            YYYY-MM-DD format
          </Text>

          {/* <CustomDatePicker date={editedDate} onChange={setEditedDate} /> */}
          <DatePicker
            selected={sideBarData.date.date}
            onChange={(date) =>
              updater({ data: date, type: "date", name: "date" })
            }
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
