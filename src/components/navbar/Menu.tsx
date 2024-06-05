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
  useToast,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiWallet } from "react-icons/bi";
import { CgTranscript } from "react-icons/cg";
import { FaGithub } from "react-icons/fa";
import { FiUser, FiUsers } from "react-icons/fi";
import { HiOutlineBookOpen, HiOutlineSwitchHorizontal } from "react-icons/hi";
import MenuNav from "./MenuNav";
import AdminMenu from "./AdminMenu";

const Menu = () => {
  const { data: userSession } = useSession();

  const isAdmin = userSession?.user?.permissions === "admin";

  const router = useRouter();
  const currentRoute = router.asPath?.split("/")[1] ?? "";
  const fullCurrentRoute = router.asPath;
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openMenu = () => {
    setMenuOpen(true);
  };

  const handleSecureLogout = async () => {
    try {
      await signOut({ redirect: false });
      await router.push("/");
    } catch (err) {
      toast({
        title: "Error",
        description: `${err}`,
        status: "error",
      });
    }
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
                        routeName={ROUTES_CONFIG.TRANSCRIPTS}
                        routeLink={ROUTES_CONFIG.TRANSCRIPTS}
                        handleClose={closeMenu}
                        icon={CgTranscript}
                      />
                      <MenuNav
                        currentRoute={currentRoute}
                        routeName={"Tutorial"}
                        routeLink={ROUTES_CONFIG.TUTORIAL}
                        handleClose={closeMenu}
                        icon={HiOutlineBookOpen}
                      />
                      <MenuNav
                        currentRoute={currentRoute}
                        routeName={ROUTES_CONFIG.WALLET}
                        routeLink={ROUTES_CONFIG.WALLET}
                        handleClose={closeMenu}
                        icon={BiWallet}
                      />
                    </Flex>
                    {isAdmin ? (
                      <AdminMenu>
                        <Flex direction="column" gap={2}>
                          <MenuNav
                            currentRoute={fullCurrentRoute}
                            routeName={"Transactions"}
                            routeLink={ROUTES_CONFIG.TRANSACTIONS}
                            handleClose={closeMenu}
                            icon={HiOutlineSwitchHorizontal}
                          />
                          <MenuNav
                            currentRoute={fullCurrentRoute}
                            routeName={ROUTES_CONFIG.REVIEWS}
                            routeLink={ROUTES_CONFIG.ALL_REVIEWS}
                            handleClose={closeMenu}
                            icon={CgTranscript}
                          />
                          <MenuNav
                            currentRoute={fullCurrentRoute}
                            routeName={"Users"}
                            routeLink={ROUTES_CONFIG.USERS}
                            handleClose={closeMenu}
                            icon={FiUsers}
                          />
                        </Flex>
                      </AdminMenu>
                    ) : null}
                  </Box>
                  <Divider />
                  <Box py={8} w="fit-content">
                    <Button
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      onClick={handleSecureLogout}
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
