import {
  Box,
  Button,
  Flex,
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
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BsFillArrowLeftCircleFill,
  BsArrow90DegDown,
  BsArrowDownShort,
} from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { IDir } from "../../../types";
import { AutoCompleteData } from "./SelectField";

interface PropsSelectDirectory {
  path: string;
  options: Array<AutoCompleteData>;
  isLoading?: boolean; // for change
  setPath: Dispatch<SetStateAction<string>>;
  customPath?: boolean;
  // eslint-disable-next-line no-unused-vars
  updateData: (x: string) => void;
}

// recursion to update nested dirs

function findAndReturnDirs(
  objArray: IDir[],
  path: string[],
  depth: number,
  index?: number
): IDir[] {
  if (depth === 0) {
    return []; // Return empty if the desired depth is reached, but the path is not found.
  }

  if (index === 1) {
    return objArray;
  }

  for (const obj of objArray) {
    if (obj.slug === path[depth - 2]) {
      if (path.length === 2 && depth === 2) {
        return obj.nestDir || []; // Return the node if the path is found at the desired depth.
      } else if (obj.nestDir) {
        const subdirectory: IDir[] = findAndReturnDirs(
          obj.nestDir,
          path.slice(1),
          depth - 1
        );
        if (subdirectory !== null) {
          return subdirectory || []; // Return the subdirectory if found at the desired depth.
        }
        return objArray;
      }
    }
  }
  return []; // Return empty if the path is not found.
}
const SelectDirectoryOption = ({
  options,
  customPath,
  updateData,
}: PropsSelectDirectory) => {
  return (
    <Box mt={2} minH={32} pl={8} maxH={32} overflowY={"scroll"}>
      {!customPath &&
        options.map((dir) => (
          <Text
            className="select-option"
            role="button"
            key={dir.slug}
            onClick={() => updateData(dir.value)}
            color="gray.800"
            _hover={{ bg: "blue.600", color: "gray.100" }}
            fontSize="14px"
            px={2}
            py={1}
          >
            {dir.slug}
          </Text>
        ))}
      {options.length < 1 && (
        <Text mt={"24px"} fontWeight={500} textAlign="center" fontSize="14px">
          {" "}
          No directories found
        </Text>
      )}
    </Box>
  );
};
const SelectDirectory = ({
  path,
  options,
  isLoading,
  setPath,
  updateData,
}: PropsSelectDirectory) => {
  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: confirmOnClose,
    isOpen: confirmIsOpen,
    onOpen: confirmOnOpen,
  } = useDisclosure();
  const pathFolder = path.split("/");
  const inputRef = useRef<HTMLInputElement>(null);
  const [customPath, setCustomPath] = useState<string>("");
  const [directoriesInPath, setDirectoriesInPath] = useState<IDir[]>([]);
  useEffect(() => {
    const foundDirs = findAndReturnDirs(
      options,
      path.split("/"),
      path.split("/").length + 1,
      path.split("/").length
    );
    setDirectoriesInPath(foundDirs);
  }, [isLoading, path, options]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomPath(e.target.value);
  };
  const handleChangeDirPath = (val: string) => {
    !customPath && updateData(val.replace(/[/]$/, "")); // replace the / at the end of the string with nothing
    onClose();
    customPath && confirmOnOpen();
  };
  const handleConfirmationPath = (val: string) => {
    updateData(val.replace(/[/]$/, "")); // replace the / at the end of the string with nothing
    confirmOnClose();
  };
  const backFolder = () => {
    setPath(
      path
        .split("/")
        .slice(0, pathFolder.length - 1)
        .join("/")
    );
  };
  return (
    <Box paddingY={"10px"}>
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        placement="bottom-start"
        initialFocusRef={inputRef}
        returnFocusOnClose={false}
        closeOnBlur={true}
        closeOnEsc={true}
        matchWidth={true}
        gutter={0}
      >
        <PopoverTrigger>
          <Input
            _placeholder={{ fontSize: "12px" }}
            height={8}
            onChange={handleChange}
            placeholder={path}
          />
        </PopoverTrigger>
        <PopoverContent mt={2} w="full" maxH={60} overflowY={"scroll"}>
          <PopoverBody as={Flex} flexDirection="column">
            <Flex justifyContent={"space-between"} alignItems="start">
              <Flex columnGap={"8px"} alignItems="start">
                {!customPath && path.length > 1 && (
                  <BsFillArrowLeftCircleFill
                    cursor={"pointer"}
                    size={24}
                    onClick={backFolder}
                  />
                )}
                <Flex flexDirection={"column"}>
                  {customPath ? (
                    <Text fontSize={"14px"} fontWeight={700} color={"gray"}>
                      {customPath}
                    </Text>
                  ) : (
                    path.split("/").map((dir, index) => (
                      <>
                        <Flex pl={index * 4} key={dir}>
                          <Text
                            fontSize={"14px"}
                            fontWeight={700}
                            color={"gray"}
                          >
                            {dir}
                          </Text>
                        </Flex>
                      </>
                    ))
                  )}
                </Flex>
              </Flex>
              <IoIosCloseCircle
                cursor={"pointer"}
                size={24}
                onClick={onClose}
              />
            </Flex>
            <SelectDirectoryOption
              updateData={updateData}
              path={customPath || path}
              setPath={setPath}
              customPath={customPath ? true : false}
              options={directoriesInPath || []}
            />
            {/* Select Path */}
            {(customPath || path) && (
              <Button
                whiteSpace={"normal"}
                fontSize={"12px"}
                colorScheme={"orange"}
                onClick={() => handleChangeDirPath(customPath || path)}
              >
                {customPath ? "Add" : "Select"} {customPath || path}
              </Button>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Modal isOpen={confirmIsOpen} onClose={confirmOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Directory Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text display="inline">Are you sure</Text>
            <span> </span>
            <Text display="inline" fontWeight={600}>
              &quot;{customPath}&quot;
            </Text>
            <span> </span>
            <Text display="inline">
              isn&apos;t in the directories list already? &nbsp; Did you
              double-check the spelling of the directory?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="outline" mr={3} onClick={confirmOnClose}>
              Let me check..
            </Button>
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => handleConfirmationPath(customPath)}
            >
              It&apos;s correct!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SelectDirectory;
