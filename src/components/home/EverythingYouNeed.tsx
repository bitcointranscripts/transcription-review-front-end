import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";

const EverythingYouNeed = () => {
  return (
    <Box py={"120px"} className="bg-container">
      <Text
        textAlign={"center"}
        fontFamily={"Polysans"}
        fontSize={{ base: "3.5rem", "2xl": "5.25rem" }}
        fontWeight={600}
      >
        Here’s everything you need to start
      </Text>
      <Flex
        flexDir={"column"}
        pt={{ base: "100px", "2xl": "200px" }}
        gap={{ base: 20, xl: 40 }}
      >
        <Step1 />
        <Step2 />
        <Step3 />
      </Flex>
    </Box>
  );
};

export default EverythingYouNeed;
