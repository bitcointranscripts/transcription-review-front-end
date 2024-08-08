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
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
};

const RestoreOriginalModal = ({
  isOpen,
  onClose: closeModal,
  onClick: Restore,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text align="center" fontWeight={600} fontSize="md" color="red.600">
            Restore Original
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure? All changes will be lost.</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={closeModal} mr={2}>
            Cancel
          </Button>
          <Button colorScheme="red" size="sm" onClick={Restore}>
            Yes, Restore!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RestoreOriginalModal;
