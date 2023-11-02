import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import GreatTranscript from "./review/GreatTranscript";
import OptimalSetup from "./review/OptimalSetup";

const ReviewingProcess = () => {
  return (
    <Box as="section" py={"100px"} width={"100%"} background={"#FAEFE3"}>
      <Flex flexDir={"column"} gap={20}  width={"100%"} className="bg-container">
        <Text
          textAlign={"center"}
          color="#262626"
          maxW={"1006px"}
          mx={"auto"}
          fontSize={"4.625rem"}
          fontWeight={"semibold"}
          lineHeight={"120%"}
        >
          And here are some tips for an{" "}
          <Text as={"span"} color={"orange"}>
            easier reviewing process{" "}
          </Text>
        </Text>
        <Flex justifyContent={"space-between"} gap="70px" >
          <GreatTranscript />
          <OptimalSetup />
        </Flex>
      </Flex>
    </Box>
  );
};

export default ReviewingProcess;
