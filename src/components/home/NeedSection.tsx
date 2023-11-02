import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import ThingsNeededSingle from "./ThingsNeededSingle";

const NeedSection = () => {
  return (
    <Box as="section" py={"40"} background={"#FAEFE3"}>
      <Flex flexDir={"column"} className="bg-container">
        <Flex>
          <Text
            fontSize={"4.5rem"}
            lineHeight="115%"
            fontWeight={600}
            maxW={"305px"}
          >
            You only need 3 things:
          </Text>
          <Flex>
            <ThingsNeededSingle />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NeedSection;
