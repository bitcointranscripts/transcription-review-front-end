// /* eslint-disable no-unused-vars */
// import useSelectNavigate from "@/hooks/useSelectNavigate";
import { Box, Text } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import React, { RefObject, useEffect, useRef } from "react";
import type { AutoCompleteData, SelectEditState } from "./SelectField";

type AutoCompleteProps = {
  autoCompleteList: Array<AutoCompleteData>;
  editState: SelectEditState;
  handleAutoCompleteSelect: (x: AutoCompleteData) => void;
  inputRef: RefObject<HTMLInputElement>;
};

const AutoComplete = ({
  autoCompleteList,
  editState,
  handleAutoCompleteSelect,
  inputRef,
}: AutoCompleteProps) => {
  const selectRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const inputElement = inputRef?.current;

  //   inputElement?.addEventListener("focusout", (e) => {
  //     selectRef?.current?.style.display && selectRef?.current?.style = {display: "none"}
  //   });

  //   return () => {};
  // }, [inputRef]);
  if (
    !autoCompleteList?.length ||
    !editState.value ||
    editState.autoCompleteValue
  )
    return null;

  const sortedSpeakers = matchSorter(autoCompleteList, editState.value, {
    keys: ["slug", "value"],
  })?.slice(0, 6);

  const handleClick = (data: AutoCompleteData) => {
    handleAutoCompleteSelect(data);
  };

  if (!sortedSpeakers?.length) return null;

  return (
    <Box
      position="absolute"
      top={0}
      mt="34px"
      zIndex={1}
      bgColor="white"
      w="full"
      borderRadius="md"
      boxShadow="md"
      ref={selectRef}
    >
      {sortedSpeakers.map((speaker) => {
        return (
          <Text
            className="select-option"
            role="button"
            key={speaker.slug}
            onClick={() => handleClick(speaker)}
            color="gray.800"
            _hover={{ bg: "blue.600", color: "gray.100" }}
            fontSize="14px"
            px={2}
            py={1}
          >
            {speaker.value}
          </Text>
        );
      })}
    </Box>
  );
};

AutoComplete.displayName = "AutoCompleteForSelectField";

export default AutoComplete;
