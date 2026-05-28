import { UI_CONFIG } from "@/config/ui-config";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";
import { SelectBox } from "./selectbox";

type Props<T extends string | string[]> = {
  name: string;
  editedData: T;
  updateData: (x: T) => void;
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

export function SelectField<T extends string | string[]>({
  name,
  editedData,
  updateData,
  autoCompleteList,
  userCanAddToList,
  horizontal,
}: Props<T>) {
  const isSingleSelect = typeof editedData === "string";

  const handleAddItem = (value: string) => {
    if (isSingleSelect) {
      updateData(value as T);
    } else {
      const updatedList = [...(editedData as string[]), value];
      updateData(updatedList as T);
    }
  };

  const handleRemoveItem = (idx: number) => {
    if (!isSingleSelect) {
      const updatedList = [...(editedData as string[])];
      updatedList.splice(idx, 1);
      updateData(updatedList as T);
    }
  };

  const handleAutoCompleteSelect = (data: AutoCompleteData) => {
    handleAddItem(data.value);
  };

  const newAutoCompleteList =
    autoCompleteList.length > UI_CONFIG.MAX_AUTOCOMPLETE_LENGTH_TO_FILTER
      ? autoCompleteList
      : autoCompleteList.filter((item) =>
          isSingleSelect
            ? item.value !== editedData
            : !(editedData as string[]).includes(item.value)
        );

  return (
    <>
      <SelectBox
        idx={-1}
        name={name}
        addItem={userCanAddToList ? handleAddItem : undefined}
        autoCompleteList={newAutoCompleteList}
        handleAutoCompleteSelect={handleAutoCompleteSelect}
        selectedValue={isSingleSelect ? (editedData as string) : undefined}
      />
      <Flex
        flexWrap="wrap"
        gap={horizontal ? 2 : undefined}
        flexDir={horizontal ? "row" : "column"}
      >
        {!isSingleSelect &&
          (editedData as string[]).map((item: string, idx: number) => (
            <Flex
              key={`${item}-idx-${idx}`}
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
                {item}
              </Text>
              <IconButton
                fontSize="16px"
                p="6px"
                size="sm"
                minW="auto"
                h="auto"
                variant="ghost"
                onClick={() => handleRemoveItem(idx)}
                aria-label={`remove ${name}`}
                icon={<BiX />}
              />
            </Flex>
          ))}
      </Flex>
    </>
  );
}
