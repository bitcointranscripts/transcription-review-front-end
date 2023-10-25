import { deriveFileSlug } from "@/utils";
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
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { BiArrowBack } from "react-icons/bi";
import { IoIosCloseCircle } from "react-icons/io";
import { IDir, TranscriptContent } from "../../../types";
import { AutoCompleteData } from "./SelectField";

interface PropsSelectDirectory {
  path: string;
  options: Array<AutoCompleteData>;
  isLoading?: boolean; // for change
  isDirLoading?: boolean;
  setPath: Dispatch<SetStateAction<string>>;
  customPath?: string;
  getUpdatedTranscript: () => TranscriptContent;
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
  if (!path[0]) {
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
  isDirLoading,
  setPath,
}: Omit<PropsSelectDirectory, "getUpdatedTranscript">) => {
  return (
    <Flex
      flexDirection={"column"}
      mt={2}
      width="100%"
      minH={32}
      maxH={32}
      overflowY={"scroll"}
    >
      {isDirLoading && (
        <Flex
          width="100%"
          mt={10}
          justifyContent={"center"}
          alignItems="center"
        >
          <Spinner />
        </Flex>
      )}
      {!isDirLoading &&
        options
          .filter((dir) =>
            dir.slug.includes(customPath ? customPath.toLowerCase() : "")
          )
          .map((dir) => (
            <Text
              className="select-option"
              role="button"
              key={dir.slug}
              onClick={() => setPath(dir.slug)}
              color="gray.800"
              _hover={{ bg: "blue.600", color: "gray.100" }}
              fontSize="14px"
              px={[2, 4, 6, 9]}
              py={1}
            >
              {dir.value}
            </Text>
          ))}
      {!isDirLoading && options.length < 1 && (
        <Text fontWeight={500} mt={10} mx="auto" fontSize="14px">
          {" "}
          No directories found
        </Text>
      )}
    </Flex>
  );
};
const SelectDirectory = ({
  path,
  options,
  isLoading,
  isDirLoading,
  setPath,
  getUpdatedTranscript,
  updateData,
}: PropsSelectDirectory) => {
  const { onClose, isOpen, onOpen } = useDisclosure();
  const updatedTranscript = getUpdatedTranscript();
  const {
    onClose: confirmOnClose,
    isOpen: confirmIsOpen,
    onOpen: confirmOnOpen,
  } = useDisclosure();
  const pathFolder = path.split("/");
  const inputRef = useRef<HTMLInputElement>(null);
  const [customPath, setCustomPath] = useState<string>("");
  const [directoriesInPath, setDirectoriesInPath] = useState<IDir[]>([]);
  useLayoutEffect(() => {
    const foundDirs = findAndReturnDirs(
      options,
      path.split("/"),
      path.split("/").length + 1,
      path.split("/").length + 1
    );
    setDirectoriesInPath(foundDirs);
  }, [isLoading, path, options]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomPath(deriveFileSlug(e.target.value, /[^a-z0-9/-\s]+/gi));
  };
  const handleChangeDirPath = (val: string) => {
    !customPath && updateData(val.replace(/[/]$/, "")); // replace the / at the end of the string with nothing
    onClose();
    customPath && confirmOnOpen();
  };
  const customPathStructure = (val: string) => {
    let arrayVal = val ? val.split("/") : "".split("");
    let pathStructure: IDir = { value: "", slug: "" };
    for (let index = 0; index < arrayVal.length; index++) {
      if (index === 0) {
        pathStructure.value = arrayVal[index];
        pathStructure.slug = arrayVal[index];
        pathStructure.nestDir = [customPathStructure(arrayVal[index + 1])];
      }
    }

    return pathStructure;
  };

  const handleConfirmationPath = (val: string) => {
    updateData(val.replace(/[/]$/, "")); // replace the / at the end of the string with nothing
    confirmOnClose();
    options.push(customPathStructure(val));
    setCustomPath("");
    if (inputRef.current === null) return;
    inputRef.current.value = "";
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
            ref={inputRef}
            _placeholder={{
              fontSize: "14px",
              color: isOpen ? "grey" : "black",
            }}
            height={8}
            onChange={handleChange}
            placeholder={!isOpen ? updatedTranscript?.loc : path}
          />
        </PopoverTrigger>
        <PopoverContent mt={2} w="full" overflowY={"scroll"}>
          <PopoverBody as={Flex} p={2} flexDirection="column">
            <Flex justifyContent={"space-between"} alignItems="start">
              <Flex columnGap={"8px"} alignItems="start">
                <BiArrowBack
                  cursor={"pointer"}
                  size={24}
                  color="#5A5A5A"
                  onClick={backFolder}
                  visibility={`${
                    !customPath && path.length > 1 ? "none" : "hidden"
                  }`}
                />

                <Flex flexDirection={"column"}>
                  {customPath ? (
                    <Text fontSize={"14px"} fontWeight={700} color={"gray"}>
                      {customPath}
                    </Text>
                  ) : (
                    <Flex pl={2}>
                      <Text fontSize={"14px"} fontWeight={700} color={"gray"}>
                        {pathFolder[pathFolder.length - 1]}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>
              <IoIosCloseCircle
                cursor={"pointer"}
                size={24}
                color="#5A5A5A"
                onClick={onClose}
              />
            </Flex>
            <SelectDirectoryOption
              updateData={updateData}
              path={customPath || path}
              setPath={setPath}
              isDirLoading={isDirLoading}
              customPath={customPath}
              options={directoriesInPath || []}
            />
            {/* Select Path */}
            {(customPath || path) && (
              <Button
                fontSize={"12px"}
                colorScheme={"orange"}
                pl="24px"
                overflow={"hidden"}
                onClick={() => handleChangeDirPath(customPath || path)}
              >
                {" "}
                <Text as="span" fontWeight={600}>
                  {customPath ? "Use:" : "Select"} &nbsp;
                </Text>
                <Text
                  maxWidth={"90%"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                  as="span"
                  fontWeight={400}
                >
                  {" "}
                  &quot;{(customPath || path).replace(/[A-Z0-9-]+\//gi, "../")}
                  &quot;{" "}
                </Text>
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
