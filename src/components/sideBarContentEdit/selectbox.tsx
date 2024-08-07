import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaSortDown } from "react-icons/fa";
import AutoComplete from "./autocomplete";
import type { AutoCompleteData, SelectEditState } from "./SelectField";

type SelectBoxProps = {
  idx: number;
  name: string;
  addItem?: (_x: string) => void;
  autoCompleteList: Array<AutoCompleteData>;
  handleAutoCompleteSelect: (data: AutoCompleteData) => void;
};

type ConfirmModalState = {
  isOpen: boolean;
  data: string;
};

export const SelectBox = ({
  idx,
  name,
  addItem,
  autoCompleteList,
  handleAutoCompleteSelect,
  selectedValue,
}: SelectBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    data: "",
  });
  const [inputState, setInputState] = useState("");
  const onAutoCompleteSelect = (data: AutoCompleteData) => {
    onClose();
    handleAutoCompleteSelect(data);
    setTimeout(() => {
      setInputState("");
    }, 500);
  };

  const handleClose = () => {
    onClose();
  };

  const openModal = (data: string) => {
    handleClose();
    setConfirmModal({ isOpen: true, data });
  };
  const closeModal = () => {
    setConfirmModal({ isOpen: false, data: "" });
  };

  const addCustomItem = () => {
    if (typeof addItem !== "function") return;
    addItem(confirmModal.data);
    closeModal();
    setInputState("");
  };

  const checkSpelling = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => {
      onOpen();
    }, 500);
  };

  return (
    <FormControl pb={2}>
      <Box position="relative" w="full">
        <Popover
          isOpen={isOpen}
          onClose={handleClose}
          onOpen={onOpen}
          placement="bottom-start"
          returnFocusOnClose={false}
          initialFocusRef={inputRef}
          closeOnBlur={true}
          closeOnEsc={true}
          matchWidth={true}
          gutter={0}
        >
          <PopoverTrigger>
            <Flex
              w="full"
              bgColor="blackAlpha.100"
              px={2}
              py={1}
              rounded="md"
              border="2px solid"
              borderColor="gray.200"
              borderRadius="md"
              cursor="pointer"
              justifyContent="space-between"
            >
              <Text color="gray.600" fontSize="14px" fontWeight={500}>
                Add {name}
              </Text>
              <Icon color="gray.600" as={FaSortDown} />
            </Flex>
          </PopoverTrigger>
          <PopoverContent w="full">
            <PopoverBody>
              <Input
                p={1}
                h="auto"
                placeholder="Search"
                fontSize="inherit"
                value={inputState}
                onChange={(e) => setInputState(e.target.value)}
                ref={inputRef}
              />
              <AutoComplete
                name={name}
                editState={{ value: inputState } as SelectEditState}
                autoCompleteList={autoCompleteList}
                onAutoCompleteSelect={onAutoCompleteSelect}
                inputRef={inputRef}
                embedded={true}
              />
              {addItem && (
                <AddCustomItem value={inputState} openModal={openModal} />
              )}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
      <Modal isOpen={confirmModal.isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text display="inline">Are you sure</Text>
            <span> </span>
            <Text display="inline" fontWeight={600}>
              &quot;{confirmModal.data}&quot;
            </Text>
            <span> </span>
            <Text display="inline">
              isn&apos;t in the list already? Did you double-check the spelling
              of the person&apos;s name?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="outline" mr={3} onClick={checkSpelling}>
              Let me check..
            </Button>
            <Button size="sm" colorScheme="green" onClick={addCustomItem}>
              It&apos;s correct!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormControl>
  );
};

const AddCustomItem = ({
  value,
  openModal,
}: {
  value: string;
  openModal: (data: string) => void;
}) => {
  return (
    <>
      {value.trim() ? (
        <Box mt={2}>
          <Divider />
          <Box
            role="button"
            mt={1}
            py={1}
            px={2}
            rounded="md"
            _hover={{ bgColor: "gray.100" }}
            _active={{ bgColor: "gray.200" }}
            onClick={() => openModal(value)}
          >
            <Flex>
              <Text mr={2} color="green.700" fontWeight={800}>
                Add:
              </Text>
              <Text color="green.700">{`"${value}"`}</Text>
            </Flex>
          </Box>
        </Box>
      ) : null}
    </>
  );
};
