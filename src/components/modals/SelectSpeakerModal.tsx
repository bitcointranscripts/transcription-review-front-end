import { useState, useLayoutEffect } from 'react';
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
    Box
} from "@chakra-ui/react";
import { OnlySelectField } from '../sideBarContentEdit/SelectField';
import { useGetMetadata } from '@/services/api/transcripts/useGetMetadata';

type Props = {
    selectedSpeakerElement: any;
    isOpen: boolean;
    onSetSpeakerName: (newSpeakerName: string | null, isUpdateAllSpeakerInstances: boolean) => void;
    onClose: () => void;
};

const SelectSpeakerModal = ({ selectedSpeakerElement, onSetSpeakerName, onClose: closeModal }: Props) => {
    const oldSpeakerName = selectedSpeakerElement?.speaker || ''
    const [newSpeakerName, setNewSpeakerName] = useState(oldSpeakerName);
    const [isUpdateAllSpeakerInstances, setIsUpdateAllSpeakerInstances] = useState(false);
    const { data: allMetadata } = useGetMetadata();


    useLayoutEffect(() => {
        if (selectedSpeakerElement) {
            setNewSpeakerName(oldSpeakerName);
            setIsUpdateAllSpeakerInstances(false);
        }
    }, [selectedSpeakerElement]);

    const handleSave = () => {
        onSetSpeakerName(newSpeakerName, isUpdateAllSpeakerInstances);
        closeModal();
    };

    const updateSpeaker = (speakers: string[]) => {
        setNewSpeakerName(speakers[0])
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <Modal isOpen={!!selectedSpeakerElement} onClose={closeModal} isCentered>
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
                        <OnlySelectField
                            name="speakers"
                            editedData={[newSpeakerName]}
                            updateData={updateSpeaker}
                            autoCompleteList={allMetadata?.speakers ?? []}
                            userCanAddToList
                            single
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
                    <Button variant="outline" size="sm" onClick={handleCancel} mr={2}>
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
