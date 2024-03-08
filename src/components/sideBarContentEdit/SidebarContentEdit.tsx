import config from "@/config/config.json";
import { useGetMetaData } from "@/services/api/transcripts/useGetMetaData";
import {
  getTimeLeftText,
  isStringArray,
  knownMetaData,
  omit,
  pick,
  toTitleCase,
  whitelistedArbitraryMetaData,
} from "@/utils";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import jsonData from "../../../public/static/directoryMetadata.json";
import {
  ArbitraryFieldValues,
  IDir,
  Review,
  Transcript,
  TranscriptContent,
} from "../../../types";
import {
  SideBarData,
  SidebarSubType,
  sideBarContentUpdateParams,
} from "../transcript";
import { DateEdit, ListEdit, TextEdit } from "./CategoryEdit";
import { OnlySelectField } from "./SelectField";

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
  // TODO: Why are this values not read?
  const [directoryList, setDirectoryList] = useState<IDir[] | []>([]);
  const [path, setPath] = useState<string>("");
  const [initialCount, setInitialCount] = useState(1);
  const { data: selectableListData } = useGetMetaData();

  const updateTextField = (field: string) => (value: string) => {
    const updatedTranscript = getUpdatedTranscript();
    updatedTranscript[field] = value;
    saveTranscript(updatedTranscript);

    updater({
      data: value,
      type: "text",
      name: field,
    });
  };

  const updateListField = (field: string) => (value: string[]) => {
    const updatedTranscript = getUpdatedTranscript();
    updatedTranscript[field] = value;
    saveTranscript(updatedTranscript);

    updater({
      data: value,
      type: "list",
      name: field,
    });
  };

  const updateDateField = (field: string) => (value: Date) => {
    const updatedTranscript = getUpdatedTranscript();
    updatedTranscript[field] = value;
    saveTranscript(updatedTranscript);

    updater({
      data: value,
      type: "date",
      name: field,
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

  const arbitraryFields = pick(
    omit(
      {
        ...sideBarData.text,
        ...sideBarData.list,
        ...sideBarData.date,
      },
      knownMetaData
    ),
    whitelistedArbitraryMetaData
  ) as Record<string, ArbitraryFieldValues>;

  return (
    <Box
      w="full"
      flex="1 1 30%"
      p={4}
      maxH="75vh"
      overflow="auto"
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
        <TextEdit
          editedData={sideBarData.text.title}
          updateData={updateTextField("title")}
          heading="Title"
        />
        <ListEdit
          heading="Speakers"
          name="speakers"
          editedData={sideBarData.list.speakers}
          updateData={updateListField("speakers")}
          autoCompleteList={selectableListData?.speakers ?? []}
          userCanAddToList
        />
        <DateEdit
          heading="Date of Recording"
          editedData={sideBarData.date.date}
          updateData={updateDateField("date")}
        />
        <ListEdit
          type="singleSelect"
          heading="Categories"
          name="category"
          editedData={sideBarData.list.categories}
          updateData={updateListField("categories")}
          autoCompleteList={selectableListData?.categories ?? []}
        />
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
            updateData={(tags) =>
              updateListField("tags")(tags.map((tag) => tag.toLowerCase()))
            }
            autoCompleteList={selectableListData?.tags ?? []}
          />
        </Box>
        {Object.keys(arbitraryFields).map((field) => {
          const fieldValue = arbitraryFields[field];

          if (Array.isArray(fieldValue) && isStringArray(fieldValue)) {
            return (
              <ListEdit
                key={field}
                // TODO: Determine dynamically which arbitrary field is a single select or onlySelect
                type="singleSelect"
                heading={toTitleCase(field)}
                name={field}
                editedData={fieldValue}
                updateData={updateListField(field)}
                // TODO: Determine how to autocomplete for arbitrary data that is an array
                autoCompleteList={selectableListData?.categories ?? []}
              />
            );
          }

          if (typeof fieldValue === "string") {
            return (
              <TextEdit
                key={field}
                editedData={fieldValue}
                updateData={updateTextField(field)}
                heading={toTitleCase(field)}
              />
            );
          }

          if (fieldValue instanceof Date)
            return (
              <DateEdit
                key={field}
                heading={toTitleCase(field)}
                editedData={fieldValue}
                updateData={updateDateField(field)}
              />
            );

          return null;
        })}
        {children}
      </Flex>
    </Box>
  );
};

export default SidebarContentEdit;
