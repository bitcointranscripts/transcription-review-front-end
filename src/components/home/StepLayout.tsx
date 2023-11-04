import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import PlayIcon from "../svgs/PlayIcon";

interface IStepLayout {
  children: React.ReactNode;
  heading: string;
  sub: string;
  stepNumber: number;
  maxW?: string;
  headingMaxW?: string;
}
const StepLayout: FC<IStepLayout> = ({
  children,
  heading,
  sub,
  stepNumber,
  maxW,
  headingMaxW,
}) => {
  const coloredText = heading.split(" ")[0];
  const othersText = heading.split(coloredText);
  return (
    <Flex flexDir={"column"}>
      <Flex gap={20} alignItems={"start"}>
        <Image
          src={"/home/cursor.png"}
          minW={{ base: "40px", "2xl": "60px" }}
          minH={{ base: "40px", "2xl": "60px" }}
          maxW={{ base: "40px", "2xl": "60px" }}
          maxH={{ base: "40px", "2xl": "60px" }}
          alt={"transcripts"}
        />
        <Flex
          flexDir={"column"}
          alignItems={"start"}
          gap={{ base: 7, "2xl": 10 }}
          maxW={maxW ? maxW : "660px"}
        >
          <Text
            fontFamily={"Polysans"}
            fontSize={{ base: "3rem", xl: "3.25rem", "2xl": "4.25rem" }}
            maxW={headingMaxW ? headingMaxW : maxW}
            lineHeight={"105%"}
          >
            Step {stepNumber}:{" "}
            <Text fontWeight={600} as={"span"}>
              <Text as="span" color={"orange"}>
                {coloredText} {""}
              </Text>
              {othersText}
            </Text>
          </Text>
          <Text
            fontFamily={"Aeonik Fono"}
            fontSize={{ base: "2rem", xl: "2rem", "2xl": "2.25rem" }}
          >
            {sub}
          </Text>
        </Flex>
      </Flex>

      <Flex flexDir={"column"}>
        <Flex justifyContent={"end"} fontFamily={" Aeonik Fono"}>
          <Button
            leftIcon={
              <Box className="dark-wrapper">
                <PlayIcon />
              </Box>
            }
            size={"lg"}
            colorScheme="dark"
            border={"1px solid #D9D9D9"}
            py={"28px"}
            background={"#E6E6E6"}
            variant={"outline"}
            borderBottomRightRadius={"0px"}
          >
            Watch tutorial
          </Button>
        </Flex>
        {children}
      </Flex>
    </Flex>
  );
};

export default StepLayout;
