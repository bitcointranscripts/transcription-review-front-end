import { Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const BTCLogo = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" h="full">
      <Link href="/">
        <Flex gap={"7px"} alignItems="center">
          <Image
            width={{ base: "25px", lg: "40px" }}
            height={{ base: "25px", lg: "40px" }}
            src="/btctranscripts.png"
            alt="Logo"
            boxSize={6}
            aspectRatio={"1:1"}
            mr={{ base: 2, md: 2 }}
          />
          <Text fontSize={["0.9rem"]} color="gray.900" fontWeight={"semibold"}>
            BTC Transcript Review
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
};

export default BTCLogo;
