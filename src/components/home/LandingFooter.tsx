import { Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

const LandingFooter = () => {
  return (
    <Flex
      bg={"#F7931A"}
      px={{ base: "32px", xl: "100px" }}
      py={{ base: "32px", xl: "82px" }}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"full"}
        lineHeight={"115%"}
      >
        <Flex
          flexDirection={"column"}
          fontWeight={500}
          gap={12}
          fontFamily={"Aeonik Fono"}
        >
          <Text fontSize={"2rem"} lineHeight={"115%"} maxW={"469px"}>
            We’d love to hear your feedback on this project
          </Text>
          <Link
            href="https://cryptpad.fr/form/#/2/form/view/3P2CsohsHOkcH7C+WdtX0-tvqjBHqXnAmz5D9yx0e04/"
            isExternal
            fontSize={"1.8rem"}
            textDecoration={"underline"}
          >
            Submit Feedback
          </Link>
        </Flex>
        <Flex
          flexDirection={"column"}
          fontWeight={500}
          gap={8}
          alignItems={"end"}
          fontFamily={"Aeonik Fono"}
        >
          <Text fontSize={"1.85rem"}>built with 🤍 by</Text>
          <Link
            href="https://bitcoindevs.xyz"
            isExternal
            fontSize={"2.75rem"}
            textDecoration={"underline"}
          >
            The Bitcoin Dev Project
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LandingFooter;
