import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import GreatTranscript from "./review/GreatTranscript";
import OptimalSetup from "./review/OptimalSetup";

const ReviewingProcess = () => {
  return (
    <Box
      as="section"
      py={{ base: "60px", lg: "100px" }}
      width={"100%"}
      background={"#FAEFE3"}
    >
      <Flex
        flexDir={"column"}
        gap={20}
        fontFamily={"Polysans"}
        width={"100%"}
        className="bg-container"
      >
        <Text
          textAlign={"center"}
          color="#262626"
          maxW={{ lg: "750px", "2xl": "1006px" }}
          mx={"auto"}
          fontSize={{ base: "1.875rem", xl: "3.375rem", "2xl": "4.625rem" }}
          fontWeight={"semibold"}
          lineHeight={"120%"}
        >
          And here are some tips for an{" "}
          <Text
            as={"span"}
            color={{ base: "#262626", lg: "orange" }}
            textAlign={"center"}
          >
            easier reviewing process{" "}
          </Text>
        </Text>
        <Flex
          justifyContent={"space-between"}
          flexDir={{ base: "column", lg: "row" }}
          gap={{ base: "36px", lg: "70px" }}
        >
          <GreatTranscript />
          <OptimalSetup />
        </Flex>
      </Flex>
    </Box>
  );
};

export default ReviewingProcess;
