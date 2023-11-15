import { Box, Text, Link } from "@chakra-ui/react";
import React from "react";
import GlobalContainer from "../GlobalContainer";

const Footer = () => {
  return (
    <Box bgColor="gray.800">
      <GlobalContainer py={8}>
        <Text
          fontSize={{ base: "14px", md: "16px" }}
          color="white"
          fontWeight={600}
          textAlign="center"
        >
          Built with ❤️ by{" "}
          <Link
            href="https://bitcoindevs.xyz"
            textDecor={"underline"}
            isExternal
            color="white"
          >
            The Bitcoin Dev Project
          </Link>
        </Text>
        <Text textAlign="center">
          <Link
            href="https://cryptpad.fr/form/#/2/form/view/3P2CsohsHOkcH7C+WdtX0-tvqjBHqXnAmz5D9yx0e04/"
            isExternal
            fontSize={{ base: "12px", md: "16px" }}
            color="white"
            fontWeight={600}
            textDecor={"underline"}
            textAlign="center"
          >
            Submit Feedback
          </Link>
        </Text>
        <Text
          fontSize={{ base: "14px", md: "16px" }}
          color="white"
          fontWeight={600}
          textAlign="center"
        >
          Vistor counts publicly available via{" "}
          <Link
            href="https://visits.bitcoindevs.xyz/share/6SxRjtdbASma578X/review-btctranscripts"
            isExternal
            fontSize={{ base: "12px", md: "16px" }}
            color="white"
            textDecor={"underline"}
            textAlign="center"
          >
            umami
          </Link>
        </Text>
      </GlobalContainer>
    </Box>
  );
};

export default Footer;
