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
        <ModalHeader>Ugh. We&apos;re sorry...</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            We do not yet support mobile devices.
          </Text>
          <br/>
          <Text>Your sats await. Just come back with a desktop or tablet.</Text>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MobileWarningModal;
