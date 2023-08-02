import { Box, Divider, Flex, Text, Link } from "@chakra-ui/react";
import React from "react";
import GlobalContainer from "../GlobalContainer";

const Footer = () => {
  return (
    <Box bgColor="gray.800">
      <GlobalContainer py={8}>
        <Text
          fontSize={{ base: "14px", md: "16px" }}
          color="gray.200"
          textAlign="center"
          >
          Built with ❤️ by{" "}
          <Link
            href="https://bitcoindevs.xyz"
            isExternal
            color="orange.200"
          >
            The Bitcoin Dev Project
          </Link>
        </Text>
        <Text
          textAlign="center"
        >
          <Link
            href="https://cryptpad.fr/form/#/2/form/view/3P2CsohsHOkcH7C+WdtX0-tvqjBHqXnAmz5D9yx0e04/"
            isExternal
            fontSize={{ base: "12px", md: "16px" }}
            color="orange.200"
            textAlign="center"
          >
            Submit Feedback
          </Link>
        </Text>
      </GlobalContainer>
    </Box>
  );
};

export default Footer;
