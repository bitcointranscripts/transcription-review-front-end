import { useState } from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Box,
} from "@chakra-ui/react";
import { SelectField } from "../sideBarContentEdit/SelectField";
import { useGetMetadata } from "@/services/api/transcripts/useGetMetadata";
import { SlateNode } from "../../../types";

type Props = {
  selectedSpeakerElement: SlateNode;
  isOpen: boolean;
  onSetSpeakerName: (
    newSpeakerName: string | null,
    isUpdateAllSpeakerInstances: boolean
  ) => void;
  onClose: () => void;
};

const SelectSpeakerModal = ({
  selectedSpeakerElement,
  onSetSpeakerName,
  onClose: closeModal,
}: Props) => {
  const oldSpeakerName = selectedSpeakerElement?.speaker || "";
  const [newSpeakerName, setNewSpeakerName] = useState("");
  const [isUpdateAllSpeakerInstances, setIsUpdateAllSpeakerInstances] =
    useState(false);
  const { data: allMetadata } = useGetMetadata();

  const handleSave = () => {
    onSetSpeakerName(newSpeakerName, isUpdateAllSpeakerInstances);
    handleClose();
  };

  const handleClose = () => {
    setNewSpeakerName("");
    setIsUpdateAllSpeakerInstances(false);
    closeModal();
  };

  return (
    <Modal isOpen={!!selectedSpeakerElement} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text align="center" fontWeight={600} fontSize="md">
            Change Speaker Name
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text fontWeight={600} mb={2}>
              Speakers
            </Text>
            <SelectField
              name="speakers"
              editedData={newSpeakerName || oldSpeakerName}
              updateData={(speaker) => setNewSpeakerName(speaker)}
              autoCompleteList={allMetadata?.speakers ?? []}
              userCanAddToList
            />
          </Box>
          <Checkbox
            isChecked={isUpdateAllSpeakerInstances}
            onChange={(e) => setIsUpdateAllSpeakerInstances(e.target.checked)}
            mt={4}
          >
            Replace all occurrences of {oldSpeakerName}
          </Checkbox>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={handleClose} mr={2}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} colorScheme="orange">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectSpeakerModal;
