import { ROUTES_CONFIG } from "@/config/ui-config";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import GlobalContainer from "../GlobalContainer";
import MenuNav from "./MenuNav";

const Navbar = () => {
  const { data: userSession } = useSession();
  const router = useRouter();
  const currentRoute = router.asPath?.split("/")[1] ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleTogglePopOver = () => setIsOpen((value) => !value);

  return (
    <Box
      as="nav"
      position="fixed"
      h={12}
      w="full"
      boxShadow="md"
      bgColor="whiteAlpha.700"
      fontSize="14px"
      isolation="isolate"
      zIndex={1}
      backdropFilter="auto"
      backdropBlur="base"
    >
      <GlobalContainer h="full">
        <Flex justifyContent="space-between" alignItems="center" h="full">
          <Link href="/">
            <Text color="gray.900" fontWeight={"semibold"}>
              BTC Transcript Review
            </Text>
          </Link>
          <Flex gap={4} alignItems="center">
            {!userSession ? (
              <Button variant={"link"} onClick={() => signIn("github")}>
                <Flex alignItems="center" gap={2}>
                  <Text>Sign In</Text>
                  <Icon as={FaGithub} />
                </Flex>
              </Button>
            ) : (
              <Flex>
                {userSession.user?.image && (
                  <Popover
                    isOpen={isOpen}
                    onClose={handleClose}
                    placement="bottom-end"
                  >
                    <PopoverTrigger>
                      <Flex alignItems="center" gap={2}>
                        <Button
                          onClick={handleTogglePopOver}
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
                      </Flex>
                    </PopoverTrigger>
                    <PopoverContent w="auto" minW="150px">
                      <PopoverBody>
                        <Flex direction="column" gap={2} pb={4}>
                          {userSession.user.githubUsername && (
                            <MenuNav
                              routeName="profile"
                              routeLink={userSession.user.githubUsername}
                              currentRoute={currentRoute}
                              handleClose={handleClose}
                            />
                          )}
                          <MenuNav
                            routeName={ROUTES_CONFIG.TUTORIAL}
                            routeLink={ROUTES_CONFIG.TUTORIAL}
                            currentRoute={currentRoute}
                            handleClose={handleClose}
                          />
                        </Flex>
                        <Divider />
                        <Box mt={4} ml="auto" w="fit-content">
                          <Button
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            onClick={() => signOut()}
                          >
                            Sign out
                          </Button>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      </GlobalContainer>
    </Box>
  );
};

export default Navbar;
