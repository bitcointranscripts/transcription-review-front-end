import { Box, Flex, Link, Text } from "@chakra-ui/react";
import React, { FC } from "react";

interface IThingsNeeded {
  Icon: React.ComponentType;
  heading: string;
  sub: string;
  link?: string;
  linkText?: string;
}
const ThingsNeededSingle: FC<IThingsNeeded> = ({
  Icon,
  heading,
  sub,
  link,
  linkText,
}) => {
  return (
    <Flex
      position={"relative"}
      minW={{
        base: "100%",
        sm: "256px",
        md: "300px",
        lg: "260px",
        xl: "267px",
        "2xl": "340px",
        "3xl": "370px",
      }}
      maxW={{
        base: "100%",
        sm: "256px",
        md: "300px",
        lg: "260px",
        xl: "267px",
        "2xl": "340px",
        "3xl": "370px",
      }}
      flexDir={"column"}
      minH={{ base: "220px", lg: "230px", "2xl": "320px" }}
      maxH={{ base: "220px", lg: "230px", "2xl": "320px" }}
      margin={"0 auto"}
      bg={"#F7F7F7"}
      rounded={"30px"}
      pt={{ base: "70px", sm: "40px", xl: "40px", "2xl": "70px" }}
      pb={{ base: "32px", sm: "40px", xl: "41px", "2xl": "58px" }}
      px={{ base: "24px", xl: "32px", "2xl": "45px" }}
    >
      <Box
        width={{ base: "50px", lg: "50px", "2xl": "70px" }}
        rounded={"full"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        bg={"orange"}
        height={{ base: "50px", lg: "50px", "2xl": "70px" }}
        position={"absolute"}
        padding={{ base: "15px", lg: "15px", "2xl": "20px" }}
        left={{ base: "45%", lg: "-16px" }}
        top={"-16px"}
      >
        <Icon />
      </Box>
      <Flex
        flexDir={"column"}
        fontFamily={"Aeonik Fono"}
        gap={{ base: "3", "2xl": 4 }}
        justifyContent={"space-between"}
        alignItems={{ base: "center", lg: "start" }}
      >
        <Text
          fontSize={[
            "1.25rem",
            "1.25rem",
            "1.5rem",
            "1.4rem",
            "1.4rem",
            "2rem",
          ]}
          whiteSpace={"pre-line"}
          textAlign={{ base: "center", lg: "left" }}
          fontWeight={700}
          minHeight={{ base: "3rem", lg: "3rem", "2xl": "5rem" }}
          lineHeight={"125%"}
        >
          {heading}
        </Text>
        <Text
          fontWeight={400}
          textAlign={{ base: "center", lg: "left" }}
          whiteSpace={"pre-line"}
          fontSize={{
            base: "0.875rem",
            md: "1.05rem",
            xl: "1.05rem",
            "2xl": "1.3rem",
            "3xl": "1.5rem",
          }}
        >
          {sub}{" "}
          {linkText && (
            <>
              <br />{" "}
              <Link isExternal textDecoration={"underline"} href={link}>
                {linkText}{" "}
              </Link>
            </>
          )}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ThingsNeededSingle;
