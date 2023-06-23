import { ROUTES_CONFIG } from "@/config/ui-config";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiMenu } from "react-icons/bi";
import MenuNav from "./MenuNav";

type MenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

const Menu = ({ isOpen, onClose, onOpen }: MenuProps) => {
  const router = useRouter();
  const currentRoute = router.asPath?.split("/")[1] ?? "";
  return (
    <>
      <Button
        size="xs"
        py={1}
        px={1}
        h="auto"
        w="fit-content"
        minW="auto"
        aria-label="hamburger-menu"
        onClick={onOpen}
      >
        <Icon as={BiMenu} fontSize="24px" color="gray.600" />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        blockScrollOnMount={true}
      >
        <DrawerOverlay />
        <DrawerContent borderLeftRadius={"lg"}>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <Flex alignItems="center" gap={4}>
              <Image
                src="/btc-transcript-circle-128.png"
                width="56"
                height="56"
                alt="btc-transcript"
              />
              <Text color="gray.700" fontWeight={"semibold"}>
                BTC Transcript Review
              </Text>
            </Flex>
            <Divider position="absolute" left={0} mt={2} h={2} />
            <Heading size="sm" mt={8} color="gray.400">
              Pages
            </Heading>
            <Box mt={4}>
              <Box w="full">
                <MenuNav
                  currentRoute={currentRoute}
                  routeName={ROUTES_CONFIG.TUTORIAL}
                />
              </Box>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Menu;
