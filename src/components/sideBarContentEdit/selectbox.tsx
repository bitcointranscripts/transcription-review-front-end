/* eslint-disable no-unused-vars */
import { Box, Flex, FormControl, IconButton, Input } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import AutoComplete from "./autocomplete";
import type { AutoCompleteData, SelectEditState } from "./SelectField";

type SelectBoxProps = {
  idx: number;
  handleUpdateEdit: (idx: number, name?: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editState: SelectEditState;
  autoCompleteList?: Array<AutoCompleteData>;
  handleAutoCompleteSelect?: (e: any) => void;
};

const SelectBox = ({
  idx,
  handleUpdateEdit,
  handleInputChange,
  editState,
  autoCompleteList,
  handleAutoCompleteSelect,
}: SelectBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <FormControl>
        <Flex gap={1} alignItems="center">
          <Box position="relative" w="full">
            <Input
              p={1}
              h="auto"
              fontSize="inherit"
              value={editState?.value}
              onChange={handleInputChange}
              ref={inputRef}
            />
            {autoCompleteList && handleAutoCompleteSelect && (
              <AutoComplete
                editState={editState}
                autoCompleteList={autoCompleteList}
                handleAutoCompleteSelect={handleAutoCompleteSelect}
                inputRef={inputRef}
              />
            )}
          </Box>
          <Flex direction="row" justifyContent="space-around" gap={1}>
            <IconButton
              name="add"
              size="sm"
              fontSize="16px"
              colorScheme="green"
              variant="outline"
              onClick={() => handleUpdateEdit(idx, "add")}
              aria-label="confirm speaker editing"
              icon={<BiCheck />}
            />
            <IconButton
              name="cancel"
              size="sm"
              fontSize="16px"
              colorScheme="red"
              variant="outline"
              onClick={() => handleUpdateEdit(idx, "cancel")}
              aria-label="reject speaker editing"
              icon={<BiX />}
            />
          </Flex>
        </Flex>
      </FormControl>
    </>
  );
};

export default SelectBox;
