import { getTimeLeftText, reconcileArray } from "@/utils";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { Review, Transcript } from "../../../types";
import SelectField from "./SelectField";
import TextField from "./TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./sidebarContentEdit.module.css";
import speakersList from "@/config/speakers.json";

type RenderProps = {
  // eslint-disable-next-line no-unused-vars
  (editedContent: EditedContent): React.ReactNode;
};

export type EditedContent = {
  editedTitle: string;
  editedSpeakers: string[];
  editedCategories: string[];
  editedTags: string[];
  editedDate: Date | null;
};

const SidebarContentEdit = ({
  data,
  claimedAt,
  children,
}: {
  data: Transcript;
  claimedAt: Review["createdAt"];
  children?: RenderProps;
}) => {
  const [editedTitle, setEditedTitle] = useState(data.content?.title ?? "");
  const [editedSpeakers, setEditedSpeakers] = useState<string[]>(
    reconcileArray(data?.content?.speakers)
  );
  const [editedCategories, setEditedCategories] = useState<string[]>(
    reconcileArray(data?.content?.categories)
  );
  const [editedTags, setEditedTags] = useState<string[]>(
    reconcileArray(data?.content?.tags)
  );

  // const dateStringFormat = dateFormatGeneral(data?.createdAt, true) as string;
  const [editedDate, setEditedDate] = useState<Date | null>(
    new Date(data?.content?.date ?? "")
  );

  const updateTitle = (newTitle: string) => {
    setEditedTitle(newTitle);
  };
  const updateSpeaker = (speakers: string[]) => {
    setEditedSpeakers(speakers);
  };
  const updateCategories = (categories: string[]) => {
    setEditedCategories(categories);
  };
  const updateTags = (categories: string[]) => {
    setEditedTags(categories);
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
            editedData={editedTitle}
            updateData={updateTitle}
          />
        </Box>
        <Box>
          <Text fontWeight={600} mb={2}>
            Speakers
          </Text>
          <SelectField
            name="speakers"
            editedData={editedSpeakers}
            updateData={updateSpeaker}
            autoCompleteList={speakersList}
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
            selected={editedDate}
            onChange={(date) => setEditedDate(date)}
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
          <SelectField
            name="categories"
            editedData={editedCategories}
            updateData={updateCategories}
          />
        </Box>
        <Box>
          <Text fontWeight={600} mb={2}>
            Tags
          </Text>
          <SelectField
            name="tags"
            editedData={editedTags}
            updateData={updateTags}
          />
        </Box>
        {children &&
          children({
            editedTitle,
            editedSpeakers,
            editedCategories,
            editedTags,
            editedDate,
          })}
      </Flex>
    </Box>
  );
};

export default SidebarContentEdit;
