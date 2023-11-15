import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import React from "react";

const MobileWarningModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Unsupported</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Unfortunately we do not support mobile devices at the moment.
          </Text>
          <Text>Please use a desktop or tablet.</Text>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MobileWarningModal;
