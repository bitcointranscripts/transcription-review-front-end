import React from "react";
import StepLayout from "../StepLayout";
import { Box, Flex, Text } from "@chakra-ui/react";
import SubStepSingle from "./SubStepSingle";
import Image from "next/image";

const Step1 = () => {
  return (
    <StepLayout
      stepNumber={1}
      heading="Claim a recording to review"
      sub="TLDR; Connect your GitHub to BTCtranscripts"
    >
      <Flex flexDir={"column"} gap={10}>
        <Flex
          pt={"70px"}
          px="70px"
          flexDir={"column"}
          borderWidth={2}
          gap={20}
          width="100%"
          borderColor={"#D9D9D9"}
          borderRadius={"30px 0px 30px 30px"}
        >
          <Flex gap={10}>
            <SubStepSingle
              isActive
              heading="Connect"
              sub="Connect your GitHub account to BTCTranscripts by clicking “Sign In”"
              maxW="332px"
            />
            <SubStepSingle
              heading="Authorize"
              sub="Authorize Bitcoin Transcripts Dev to access to your aassoiants account"
              maxW="332px"
            />
            <SubStepSingle
              sub="In simple English, it means that BTCTranscripts will write your transcript onto GitHub so that it can be reviewed."
              maxW="412px"
            />
          </Flex>
          <Box
            p={1}
            borderWidth={2}
            borderColor={"#D9D9D9"}
            borderRadius={"30px 0px 30px 30px"}
          >
            <Box position={"relative"} marginBottom={"-7px"} minH={"500px"}>
              <Image
                src="/home/authorize-landing.png"
                alt="authorize github page"
                objectFit="cover"
                fill
              />
            </Box>
          </Box>
        </Flex>

        <Flex
          pt={"90px"}
          pl="70px"
          justifyContent={"space-between"}
          gap={10}
          borderWidth={2}
          borderColor={"#D9D9D9"}
          borderRadius={"30px 0px 30px 30px"}
        >
          <Flex flexDir={"column"} gap={4} maxW={"386px"}>
            <Text>
              Once signed in, find a transcript that catches your fancy, and
              click “Claim.”
            </Text>
            <Text>Now, it’s time to edit!</Text>
          </Flex>
          <Box
            py={1}
            pl={1}
            borderWidth={2}
            width={"100%"}
            borderColor={"#D9D9D9"}
            borderRadius={"30px 0px 30px 0px"}
          >
            <Box position={"relative"} marginBottom={"-10px"} minH={"346px"}>
              <Image
                src="/home/claim-transcript.png"
                alt="authorize github page"
                objectFit="contain"
                fill
              />
            </Box>
          </Box>
        </Flex>
      </Flex>
    </StepLayout>
  );
};

export default Step1;
