import { Box, BoxProps, Text } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import React, { RefObject, useRef } from "react";
import type { AutoCompleteData, SelectEditState } from "./SelectField";

type AutoCompleteProps = {
  autoCompleteList: Array<AutoCompleteData>;
  editState: SelectEditState;
  onAutoCompleteSelect: (x: AutoCompleteData) => void;
  inputRef: RefObject<HTMLInputElement>;
  embedded?: boolean;
};

const AutoComplete = ({
  autoCompleteList,
  editState,
  onAutoCompleteSelect,
  inputRef,
  embedded,
}: AutoCompleteProps) => {
  const selectRef = useRef<HTMLDivElement>(null);

  const boxContainerProps: BoxProps = embedded
    ? { mt: 2 }
    : {
        position: "absolute",
        top: 0,
        mt: "34px",
        borderRadius: "md",
        boxShadow: "md",
        bgColor: "white",
      };

  if (!autoCompleteList?.length || editState.autoCompleteValue) return null;

  let sortedSpeakers = matchSorter(autoCompleteList, editState.value, {
    keys: ["key", "value"],
  });

  const handleClick = (data: AutoCompleteData) => {
    onAutoCompleteSelect(data);
  };

  if (!sortedSpeakers?.length) return null;

  return (
    <Box
      {...boxContainerProps}
      zIndex={1}
      w="full"
      maxH={48}
      overflow="scroll"
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
