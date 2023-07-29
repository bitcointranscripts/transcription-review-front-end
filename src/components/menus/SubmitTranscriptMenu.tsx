import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { MdArrowDropDown } from "react-icons/md";

export type TranscriptSubmitOptions = "user" | "btc transcript";
type Props = {
  setPrRepo: Dispatch<SetStateAction<TranscriptSubmitOptions>>;
};

const SubmitTranscriptMenu = ({ setPrRepo }: Props) => {
  return (
    <Menu>
      <MenuButton
        borderRadius="none"
        as={Button}
        size="sm"
        colorScheme="orange"
        px={1}
        borderLeftWidth={1.5}
        onClick={(event) => event.stopPropagation()}
      >
        <MdArrowDropDown size={20} />
      </MenuButton>
      <MenuList color="black">
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            setPrRepo("user");
          }}
        >
          Submit (User PR)
        </MenuItem>
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            setPrRepo("btc transcript");
          }}
        >
          Submit (BTC Transcripts PR)
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SubmitTranscriptMenu;
