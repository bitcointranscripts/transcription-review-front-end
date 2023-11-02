import { Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const BTCLogo = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" h="full">
      <Link href="/">
        <Flex gap={"7px"} alignItems="center">
          <Image
            width={"50px"}
            src="/btctranscripts.png"
            alt="Logo"
            boxSize={6}
            mr={2}
          />
          <Text color="gray.900" fontWeight={"semibold"}>
            BTC Transcript Review
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
};

export default BTCLogo;
