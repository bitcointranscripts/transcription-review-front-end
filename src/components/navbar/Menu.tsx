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
      {!userSession ? (
        <Button variant={"link"} onClick={() => signIn("github")}>
          <Flex alignItems="center" gap={2}>
            <Text>Sign In</Text>
            <Icon as={FaGithub} />
          </Flex>
        </Button>
      ) : (
        <>
          {userSession.user?.image && (
            <Button
              onClick={openMenu}
              variant="unstyled"
              h="auto"
              w="auto"
              minW="auto"
            >
              <Box
                p={1}
                border="2px solid"
                borderColor="orange.300"
                borderRadius="full"
              >
                <Image
                  src={userSession.user?.image}
                  width="24"
                  height="24"
                  alt="profile"
                  style={{ borderRadius: "100%" }}
                />
              </Box>
            </Button>
          )}
          <Drawer
            isOpen={menuOpen}
            placement="right"
            onClose={closeMenu}
            blockScrollOnMount={true}
          >
            <DrawerOverlay />
            <DrawerContent borderLeftRadius={"lg"}>
              <DrawerCloseButton />
              <DrawerHeader></DrawerHeader>
              <DrawerBody>
                <Flex direction="column" h="full">
                  <Box flex="1 1">
                    <Flex gap={4}>
                      <Image
                        src={
                          userSession.user?.image ??
                          "/btc-transcript-circle-128.png"
                        }
                        width="56"
                        height="56"
                        style={{
                          borderRadius: "50%",
                          boxShadow: "var(--chakra-shadows-lg)",
                        }}
                        alt="profile"
                      />
                      <Flex direction="column" justifyContent="space-around">
                        <Text color="gray.600" fontWeight={"semibold"}>
                          {userSession.user?.githubUsername}
                        </Text>
                        <Text textTransform="capitalize" fontSize="14px">
                          {userSession.user?.permissions}
                        </Text>
                      </Flex>
                    </Flex>
                    <Divider my={4} />
                    <Heading size="sm" mt={6} color="gray.400">
                      Pages
                    </Heading>
                    <Flex mt={4} direction="column" gap={2}>
                      <MenuNav
                        currentRoute={currentRoute}
                        routeName="home"
                        routeLink={ROUTES_CONFIG.HOME}
                        handleClose={closeMenu}
                        icon={FiHome}
                      />
                      {userSession?.user?.githubUsername && (
                        <MenuNav
                          routeName="account"
                          routeLink={userSession.user.githubUsername}
                          currentRoute={currentRoute}
                          handleClose={closeMenu}
                          icon={FiUser}
                        />
                      )}
                      <MenuNav
                        currentRoute={currentRoute}
                        routeName={ROUTES_CONFIG.TUTORIAL}
                        routeLink={ROUTES_CONFIG.TUTORIAL}
                        handleClose={closeMenu}
                        icon={HiOutlineBookOpen}
                      />
                      <MenuNav
                        currentRoute={currentRoute}
                        routeName={"wallet"}
                        routeLink={"wallet"}
                        handleClose={closeMenu}
                        icon={HiOutlineBookOpen}
                      />
                    </Flex>
                  </Box>
                  <Divider />
                  <Box py={8} w="fit-content">
                    <Button
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      onClick={() => signOut()}
                    >
                      Sign out
                    </Button>
                  </Box>
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
};

export default Menu;
