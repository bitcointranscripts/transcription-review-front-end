import { Box, Flex, Text } from "@chakra-ui/react";
import React, { FC } from "react";

interface ISubStepSingle {
  heading?: string;
  isActive?: boolean;
  boldString?: string;
  sub: string;
  maxW: string;
}
const SubStepSingle: FC<ISubStepSingle> = ({
  isActive,
  heading,
  boldString,
  sub,
  maxW,
}) => {
  return (
    <Flex flexDir={"column"} width={"100%"} gap={6} maxW={maxW}>
      {heading && (
        <Flex gap={4} alignItems={"center"}>
          {heading && (
            <Box
              minH={"30px"}
              maxH={"30px"}
              minW={"30px"}
              maxW={"30px"}
              borderRadius={"50%"}
              bg={`${isActive ? "#333" : "#A6A6A6"}`}
            />
          )}
          <Text
            color={isActive ? "#333" : "#A6A6A6"}
            fontSize={"1.5rem"}
            fontWeight={700}
          >
            {heading || ""} <Text as="span">{boldString || ""}</Text>
          </Text>
        </Flex>
      )}
      <Text color={isActive ? "#333" : "#A6A6A6"} fontSize={"1.5rem"}>
        {sub}
      </Text>
    </Flex>
  );
};

export default SubStepSingle;
