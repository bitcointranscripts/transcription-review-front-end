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
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiHome, FiUser } from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi";
import MenuNav from "./MenuNav";

const Menu = () => {
  const { data: userSession } = useSession();
  const router = useRouter();
  const currentRoute = router.asPath?.split("/")[1] ?? "";

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openMenu = () => {
    setMenuOpen(true);
  };

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
            <Divider my={4} />
            <Heading size="sm" mt={6} color="gray.400">
              Pages
            </Heading>
            <Box mt={4}>
              <Box w="full">
                <MenuNav
                  currentRoute={currentRoute}
                  routeName={ROUTES_CONFIG.TUTORIAL}
                  routeLink={ROUTES_CONFIG.TUTORIAL}
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
