import React from "react";
import StepLayout from "../StepLayout";
import { Box, Flex, Text } from "@chakra-ui/react";
import SubStepSingle from "./SubStepSingle";
import Image from "next/image";

const Step2 = () => {
  return (
    <StepLayout
      stepNumber={2}
      heading="Start reviewing and editing the transcript"
      sub="TLDR; Use markdown. Make sure stuff is accurate. Use “replace” in case of multispeaker transcripts. Use split screen to listen and edit transcript at the same time."
      maxW={"1000px"}
      headingMaxW={"700px"}
    >
      <Flex flexDir={"column"} gap={10}>
        <Flex
          py={"70px"}
          px="70px"
          flexDir={"column"}
          borderWidth={2}
          gap={20}
          width="100%"
          borderColor={"#D9D9D9"}
          borderRadius={"30px 0px 30px 30px"}
        >
          <Flex gap={16}>
            <SubStepSingle
              isActive
              heading="Using Markdown"
              sub="We use markdown. This is a way of writing text that tells computers how to display information - like what's a title, header, what’s bolded, and the like."
              maxW="540px"
            />
            <SubStepSingle
              sub="You probably won’t need to use anything apart from Header 1, Header 2, bolding, italics, and hyperlinks. Here's a super quick primer."
              maxW="536px"
            />
          </Flex>
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
          <Flex
            lineHeight={"135%"}
            flexDir={"column"}
            gap={4}
            maxW={"386px"}
            color={"#262626"}
            fontSize={{ base: "1.25rem", xl: "1.75rem" }}
            fontFamily={"Polysans"}
          >
            <Text>
              Here is what you’ll see as you{" "}
              <Text as={"span"}>edit the transcript</Text>
            </Text>
            <Text>
              Notice the use of Header 1, Header 2, and hyperlinks with
              markdown.
            </Text>
          </Flex>
          <Box
            py={1}
            pl={1}
            borderWidth={2}
            width={"100%"}
            borderColor={"#D9D9D9"}
            borderRadius={"30px 0px 30px 0px"}
          >
            <Box position={"relative"} minH={"450px"}>
              <Image
                src="/home/editing-interface.png"
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
          <Flex
            flexDir={"column"}
            lineHeight={"135%"}
            gap={4}
            maxW={"386px"}
            fontSize={{ base: "1.25rem", xl: "1.75rem" }}
            fontFamily={"Polysans"}
          >
            <Text>Here is what will live in the GitHub repository.</Text>
            <Text>
              This is automatically created when you submit your transcript.
            </Text>
          </Flex>
          <Box
            py={1}
            pl={1}
            borderWidth={2}
            width={"100%"}
            borderColor={"#D9D9D9"}
            borderRadius={"30px 0px 30px 0px"}
          >
            <Box position={"relative"} minH={"450px"}>
              <Image
                src="/home/raw-markdown.png"
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
          <Flex
            lineHeight={"135%"}
            flexDir={"column"}
            gap={4}
            maxW={"386px"}
            fontSize={{ base: "1.25rem", xl: "1.75rem" }}
            fontFamily={"Polysans"}
          >
            <Text>Here is what will live on the live site.</Text>
            <Text>
              This is also automatically created once the review is finalized.
            </Text>
          </Flex>
          <Box
            py={1}
            pl={1}
            borderWidth={2}
            width={"100%"}
            borderColor={"#D9D9D9"}
            borderRadius={"30px 0px 30px 0px"}
          >
            <Box position={"relative"} minH={"450px"}>
              <Image
                src="/home/live-site.png"
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

export default Step2;
