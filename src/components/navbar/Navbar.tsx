import { Box, Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import GlobalContainer from "../GlobalContainer";
import Menu from "./Menu";

const Navbar = () => {
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
            <Flex alignItems="center">
              <Image src="./btctranscripts.png" alt="Logo" boxSize={6} mr={2}/>
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
