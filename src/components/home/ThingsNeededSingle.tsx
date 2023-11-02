import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

const ThingsNeededSingle = () => {
  return (
    <Flex
      position={"relative"}
      minW={"370px"}
      maxW={"370px"}
      minH={"320px"}
      maxH={"320px"}
      bg={"#F7F7F7"}
      rounded={"30px"}
      py="80px"
      px="45px"
    >
      <Box
        width={"70px"}
        rounded={"full"}
        bg={"orange"}
        height={"70px"}
        position={"absolute"}
        left={"-16px"}
        top={"-16px"}
      >
        {/* SVG */}
      </Box>
      <Flex maxW={"223px"} flexDir={"column"} gap="10">
        <Text fontSize={"2rem"}>A computer</Text>
        <Text fontWeight={500} fontFamily={"1.5rem"}
        
        >*You won’t be able <br/>to do this on a mobile phone</Text>
      </Flex>
    </Flex>
  );
};

export default ThingsNeededSingle;
