import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";

const SelectSourceMenu = ({
  isLoading,
  sources,
  onSelection: selectSource,
}: {
  isLoading?: boolean;
  sources?: string[];
  onSelection: (source: string) => void;
}) => (
  <Menu>
    <MenuButton
      as={Button}
      isLoading={isLoading}
      aria-label="select source"
      colorScheme="orange"
    >
      <Flex gap={2} alignItems={"center"}>
        <Text> Select Source </Text>
        <MdArrowDropDown size={20} />
      </Flex>
    </MenuButton>
    <MenuList color="black">
      {sources &&
        sources.map((source) => (
          <MenuItem
            key={source}
            onClick={() => {
              selectSource(source);
            }}
          >
            {source}
          </MenuItem>
        ))}
    </MenuList>
  </Menu>
);

export default SelectSourceMenu;
