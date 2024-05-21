import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";

const EverythingYouNeed = () => {
  return (
    <Box id="tutorial" py={{ base: "80px", lg: "120px" }} className="bg-container">
      <Text
        textAlign={"center"}
        fontFamily={"Polysans"}
        fontSize={{
          base: "1.875rem",
          lg: "3.2rem",
          xl: "4rem",
          "2xl": "4.8rem",
        }}
        fontWeight={600}
        lineHeight={"115%"}
      >
        Here’s everything you need to start
      </Text>
      <Flex
        flexDir={"column"}
        pt={{ base: "64px", lg: "100px", "2xl": "200px" }}
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
