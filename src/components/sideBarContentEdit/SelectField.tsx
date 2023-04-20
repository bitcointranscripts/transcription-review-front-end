import { Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BiPencil } from "react-icons/bi";
import SelectBox from "./selectbox";

type Props = {
  name: string;
  editedData: string[];
  // eslint-disable-next-line no-unused-vars
  updateData: (x: string[]) => void;
  autoCompleteList?: Array<AutoCompleteData>;
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

const initialEditState: SelectEditState = {
  idx: -1,
  value: "",
  autoCompleteValue: "",
};

const SelectField = ({
  name,
  editedData,
  updateData,
  autoCompleteList,
}: Props) => {
  const [isNew, setIsNew] = useState(false);

  const [editState, setEditState] = useState<SelectEditState>(initialEditState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    setEditState((prev) => ({
      ...prev,
      value: inputValue,
      autoCompleteValue: "",
    }));
  };

  const handleUpdateEdit = (idx: number, name?: string) => {
    if (name && name === "remove") {
      toggleEdit(idx);
      return;
    }
    let updatedSpeakers = [...editedData];
    if (!editState.value.trim()) {
      updatedSpeakers.splice(idx, 1);
    } else {
      updatedSpeakers[idx] = editState.value;
    }
    updateData(updatedSpeakers);
    toggleEdit(idx);
  };

  const handleNewSpeaker = (idx: number, name?: string) => {
    setIsNew(false);
    if (name && name === "remove") {
      return;
    }
    let updatedSpeakers = [...editedData];
    if (!editState.value) {
      return;
    } else {
      updatedSpeakers.push(editState.value);
    }
    updateData(updatedSpeakers);
  };

  const handleAutoCompleteSelect = (data: AutoCompleteData) => {
    setEditState((prev) => ({
      ...prev,
      value: data.value,
      autoCompleteValue: data.value,
    }));
  };

  const toggleEdit = (idx: number) => {
    // ensure only one select at a time
    if (idx !== -1 && isNew) {
      setIsNew(false);
    }
    editState.idx === idx
      ? setEditState(initialEditState)
      : setEditState((prev) => ({
          ...prev,
          idx,
          value: editedData[idx] ?? "",
        }));
  };

  const addNewSpeaker = () => {
    toggleEdit(-1);
    setIsNew(true);
  };

  return (
    <>
      {editedData?.map((speaker: string, idx: number) => {
        return idx === editState.idx ? (
          <SelectBox
            key={speaker}
            idx={idx}
            editState={editState}
            handleInputChange={handleInputChange}
            handleUpdateEdit={handleUpdateEdit}
            autoCompleteList={autoCompleteList}
            handleAutoCompleteSelect={handleAutoCompleteSelect}
          />
        ) : (
          <Flex
            key={speaker}
            justifyContent="space-between"
            gap={1}
            alignItems="center"
          >
            <Text fontSize="14px">{speaker}</Text>
            <IconButton
              fontSize="16px"
              p="6px"
              size="sm"
              minW="auto"
              h="auto"
              variant="ghost"
              onClick={() => toggleEdit(idx)}
              aria-label="edit speaker"
              icon={<BiPencil />}
            />
          </Flex>
        );
      })}
      {isNew ? (
        <SelectBox
          idx={-1}
          editState={editState}
          handleInputChange={handleInputChange}
          handleUpdateEdit={handleNewSpeaker}
          autoCompleteList={autoCompleteList}
          handleAutoCompleteSelect={handleAutoCompleteSelect}
        />
      ) : (
        <Button
          ml="auto"
          variant="ghost"
          colorScheme="blue"
          size="sm"
          onClick={addNewSpeaker}
        >
          <Text textTransform="uppercase" fontSize="12px">
            Add {name} +
          </Text>
        </Button>
      )}
    </>
  );
};

export default SelectField;
