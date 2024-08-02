import { UI_CONFIG } from "@/config/ui-config";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { SelectBox } from "./selectbox";

type Props = {
  name: string;
  editedData: string[];
  // eslint-disable-next-line no-unused-vars
  updateData: (x: string[]) => void;
  autoCompleteList: Array<AutoCompleteData>;
  userCanAddToList?: boolean;
  horizontal?: boolean;
};

export type AutoCompleteData = {
  slug: string;
  value: string;
};

export type SelectEditState = {
  idx: number;
  value: string;
  autoCompleteValue: string;
};

export const SelectField = ({
  name,
  editedData,
  updateData,
  autoCompleteList,
  userCanAddToList,
  horizontal,
}: Props) => {
  const handleAddItem = (value: string) => {
    let updatedList = [...editedData];
    updatedList.push(value);
    updateData(updatedList);
  };

  const handleRemoveItem = (idx: number) => {
    let updatedList = [...editedData];
    updatedList.splice(idx, 1);
    updateData(updatedList);
  };

  const handleAutoCompleteSelect = (data: AutoCompleteData) => {
    handleAddItem(data.value);
  };

  // remove previuosly selected option from list
  const newAutoCompleteList =
    autoCompleteList.length > UI_CONFIG.MAX_AUTOCOMPLETE_LENGTH_TO_FILTER
      ? autoCompleteList
      : autoCompleteList.filter((item) => !editedData.includes(item.value));

  return (
    <>
      <SelectBox
        idx={-1}
        name={name}
        addItem={userCanAddToList ? handleAddItem : undefined}
        autoCompleteList={newAutoCompleteList}
        handleAutoCompleteSelect={handleAutoCompleteSelect}
      />
      <Flex
        flexWrap="wrap"
        gap={horizontal ? 2 : undefined}
        flexDir={horizontal ? "row" : "column"}
      >
        {editedData?.map((speaker: string, idx: number) => {
          return (
            <Flex
              key={`${speaker}-idx-${idx}`}
              justifyContent="space-between"
              alignItems="center"
              py={1}
              px={2}
              gap={2}
              borderRadius={6}
              bg={horizontal ? "orange.100" : undefined}
            >
              <Text
                textTransform={name !== "speakers" ? "lowercase" : "none"}
                fontSize="14px"
              >
                {speaker}
              </Text>
              <IconButton
                fontSize="16px"
                p="6px"
                size="sm"
                minW="auto"
                h="auto"
                variant="ghost"
                onClick={() => handleRemoveItem(idx)}
                aria-label="edit speaker"
                icon={<BiX />}
              />
            </Flex>
          );
        })}
      </Flex>
    </>
  );
};
