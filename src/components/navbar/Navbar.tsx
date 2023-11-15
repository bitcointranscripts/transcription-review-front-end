import { Box, Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import GlobalContainer from "../GlobalContainer";
import Menu from "./Menu";
import useNoContainerLimit from "@/hooks/useNoContainerLimit";

const Navbar = () => {
  const { noRestriction } = useNoContainerLimit();
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
      zIndex={100}
      backdropFilter="auto"
      backdropBlur="base"
    >
      <GlobalContainer h="full" {...(noRestriction ? { maxW: "1440px"} : {})}>
        <Flex justifyContent="space-between" alignItems="center" h="full">
          <Link href="/home">
            <Flex alignItems="center">
              <Image src="/btctranscripts.png" alt="Logo" boxSize={6} mr={2} />
              <Text color="gray.900" fontWeight={"semibold"}>
                BTC Transcript Review
              </Text>
            </Flex>
          </Link>
          <Menu />
        </Flex>
      </GlobalContainer>
    </Box>
  );
};

export default Navbar;
