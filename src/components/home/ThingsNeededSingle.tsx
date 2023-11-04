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
      minW={["100%", "320px", "320px", "320px", "320px", "370px"]}
      maxW={["100%", "320px", "320px", "320px", "320px", "370px"]}
      minH={["280px", "280px", "320px"]}
      maxH={["280px", "280px", "320px"]}
      bg={"#F7F7F7"}
      rounded={"30px"}
      pt="70px"
      px="45px"
    >
      <Box
        width={["70px"]}
        rounded={"full"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        bg={"orange"}
        height={["70px"]}
        position={"absolute"}
        padding={"20px"}
        left={"-16px"}
        top={"-16px"}
      >
        <Icon />
      </Box>
      <Flex flexDir={"column"} fontFamily={"Aeonik Fono"} gap="4">
        <Text
          fontSize={["1.5rem", "1.5rem", "1.5rem", "1.5rem", "1.5rem", "2rem"]}
          fontWeight={700}
          minHeight={"5rem"}
          lineHeight={"125%"}
        >
          {heading}
        </Text>
        <Text
          fontWeight={500}
          fontSize={[
            "1.25rem",
            "1.25rem",
            "1.25rem",
            "1.25rem",
            "1.25rem",
            "2rem",
          ]}
        >
          {sub}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ThingsNeededSingle;
