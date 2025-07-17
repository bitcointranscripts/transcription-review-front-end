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
          gap={{ base: 4 }}
          fontFamily={"Aeonik Fono"}
          maxW={{ base: "50%", lg: "469px" }}
        >
          <Text
            fontSize={{
              base: "0.96rem",
              lg: "1.16rem",
              xl: "1.63rem",
              "2xl": "2.25rem",
            }}
            lineHeight={"115%"}
            maxW={{
              base: "",
              sm: "200px",
              lg: "300px",
              xl: "400px",
              "2xl": "500px",
            }}
          >
            We’d love to hear your feedback on this project
          </Text>
          <Link
            href="https://forms.gle/aLtBMjAeLZiKCFxn8"
            isExternal
            fontSize={{
              base: "0.875rem",
              lg: "1.5rem",
              xl: "1.5rem",
              "2xl": "2rem",
            }}
            textDecoration={"underline"}
          >
            Submit Feedback
          </Link>
        </Flex>
        <Flex
          flexDirection={"column"}
          fontWeight={500}
          gap={{ base: 1, lg: 4 }}
          alignItems={"end"}
          fontFamily={"Aeonik Fono"}
        >
          <Text
            fontFamily={"Polysans"}
            fontSize={{
              base: "0.96rem",
              lg: "1.16rem",
              xl: "1.63rem",
              "2xl": "2.25rem",
            }}
          >
            built with 🤍 by
          </Text>
          <Link
            href="https://bitcoindevs.xyz"
            isExternal
            fontSize={{
              base: "1.25rem",
              lg: "2.125rem",
              xl: "3.125rem",
              "2xl": "3.25rem",
            }}
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
