import { Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

const LandingFooter = () => {
  return (
    <Flex
      bg={"#F7931A"}
      px={{ base: "1px", xl: "100px" }}
      py={{ base: "32px", xl: "82px" }}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={{ base: "", lg: "center" }}
        width={"full"}
        className="bg-container"
        gap={{ base: 3, lg: "0px" }}
        lineHeight={"115%"}
      >
        <Flex
          flexDirection={"column"}
          fontWeight={500}
          justifyContent={"space-between"}
          gap={{ base: 6, lg: 12 }}
          fontFamily={"Aeonik Fono"}
          maxW={{ base: "50%", lg: "none" }}
        >
          <Text
            fontSize={{ base: "0.875rem", lg: "2rem" }}
            lineHeight={"115%"}
            maxW={"469px"}
          >
            We’d love to hear your feedback on this project
          </Text>
          <Link
            href="https://cryptpad.fr/form/#/2/form/view/3P2CsohsHOkcH7C+WdtX0-tvqjBHqXnAmz5D9yx0e04/"
            isExternal
            fontSize={{ base: "0.875rem", lg: "2rem" }}
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
          <Text fontSize={{ base: "0.96rem", lg: "1.85rem" }}>
            built with 🤍 by
          </Text>
          <Link
            href="https://bitcoindevs.xyz"
            isExternal
            fontSize={{ base: "1.25rem", lg: "2.75rem" }}
            textDecoration={"underline"}
            textAlign={"right"}
            lineHeight={{ base: "150%", lg: "115%" }}
          >
            The Bitcoin Dev Project
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LandingFooter;
