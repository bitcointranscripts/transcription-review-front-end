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
      minW={["100%", "256px", "320px", "280px", "320px", "370px"]}
      maxW={["100%", "256px", "320px", "280px", "320px", "370px"]}
      minH={["217px", "217px", "320px"]}
      maxH={["217px", "217px", "320px"]}
      margin={"0 auto"}
      bg={"#F7F7F7"}
      rounded={"30px"}
      pt={{ base: "70px", lg: "70px" }}
      pb={{ base: "0px", xl: "58px" }}
      px={{ base: "24px", lg: "45px" }}
    >
      <Box
        width={{ base: "50px", lg: "70px" }}
        rounded={"full"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        bg={"orange"}
        height={{ base: "50px", lg: "70px" }}
        position={"absolute"}
        padding={{ base: "15px", lg: "20px" }}
        left={{ base: "45%", lg: "-16px" }}
        top={"-16px"}
      >
        <Icon />
      </Box>
      <Flex flexDir={"column"} fontFamily={"Aeonik Fono"} gap="4">
        <Text
          fontSize={[
            "1.25rem",
            "1.25rem",
            "1.5rem",
            "1.5rem",
            "1.5rem",
            "2rem",
          ]}
          textAlign={{ base: "center", lg: "left" }}
          fontWeight={700}
          minHeight={{ base: "", lg: "5rem" }}
          lineHeight={"125%"}
        >
          {heading}
        </Text>
        <Text
          fontWeight={{ base: 400, lg: 500 }}
          textAlign={{ base: "center", lg: "left" }}
          fontSize={[
            "0.875rem",
            "0.875rem",
            "1.25rem",
            "1.25rem",
            "1.25rem",
            "1.5rem",
          ]}
        >
          {sub}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ThingsNeededSingle;
