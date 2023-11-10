import { Box, Flex, Text } from "@chakra-ui/react";
import React, { FC } from "react";

interface IThingsNeeded {
  Icon: React.ComponentType;
  heading: string;
  sub: string;
}
const ThingsNeededSingle: FC<IThingsNeeded> = ({ Icon, heading, sub }) => {
  return (
    <Flex
      position={"relative"}
      minW={"370px"}
      maxW={"370px"}
      minH={"320px"}
      maxH={"320px"}
      bg={"#F7F7F7"}
      rounded={"30px"}
      pt="70px"
      px="45px"
    >
      <Box
        width={"70px"}
        rounded={"full"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        bg={"orange"}
        height={"70px"}
        position={"absolute"}
        left={"-16px"}
        top={"-16px"}
      >
        <Icon />
      </Box>
      <Flex  flexDir={"column"} gap="4">
        <Text fontSize={"2rem"} minHeight={"5rem"} lineHeight={"125%"}>
          {heading}
        </Text>
        <Text fontWeight={500} fontSize={"1.5rem"}>
          {sub}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ThingsNeededSingle;
