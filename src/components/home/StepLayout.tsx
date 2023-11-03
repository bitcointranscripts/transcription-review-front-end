import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import PlayIcon from "../svgs/PlayIcon";

interface IStepLayout {
  children: React.ReactNode;
  heading: string;
  sub: string;
  stepNumber: number;
}
const StepLayout: FC<IStepLayout> = ({
  children,
  heading,
  sub,
  stepNumber,
}) => {
  return (
    <Flex flexDir={"column"}>
      <Flex gap={20}>
        <Image
          src={"/home/cursor.png"}
          minW={"80px"}
          minH={"80px"}
          maxW={"80px"}
          maxH={"80px"}
          alt={"transcripts"}
        />
        <Flex flexDir={"column"}>
          <Text>
            Step {stepNumber}: <Text as={"span"}>{heading}</Text>
          </Text>
          <Text>{sub}</Text>
        </Flex>
      </Flex>

      <Flex flexDir={"column"}>
        <Flex justifyContent={"end"}>
          <Button
            leftIcon={
              <Box className="dark-wrapper">
                <PlayIcon />
              </Box>
            }
            size={"lg"}
            colorScheme="dark"
            border={"1px solid #D9D9D9"}
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
