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
      src="/home/edit-transcript.png"
      headingMaxW={"700px"}
      link={"https://www.youtube.com/watch?v=YNIFm0QFAuA&t=2m32s"}
    >
      <Flex flexDir={"column"} gap={10}>
        <Flex
          py={{ base: "0px", lg: "70px" }}
          px={{ base: "0px", lg: "70px" }}
          flexDir={"column"}
          borderWidth={{ base: 0, lg: 2 }}
          gap={20}
          width="100%"
          borderColor={"#D9D9D9"}
          borderRadius={"30px 0px 30px 30px"}
        >
          <Flex
            flexDir={{ base: "column", lg: "row" }}
            gap={{ base: "24px", lg: 16 }}
            py={{ base: "22px", lg: "0px" }}
            borderRadius={{ base: "12px", lg: "0px" }}
            px={{ base: "22px", lg: "0px" }}
            borderColor={"#D9D9D9"}
            borderWidth={{ base: 1.5, lg: "0px" }}
          >
            <SubStepSingle
              isActive
              heading="Using Markdown"
              sub="We use markdown. This is a way of writing text that tells computers how to display information - like what's a title, header, what’s bolded, and the like."
              maxW="540px"
            />
            <SubStepSingle
              isActive
              sub="You probably won’t need to use anything apart from Header 1, Header 2, bolding, italics, and hyperlinks. Here's a super quick primer."
              maxW="536px"
              href="https://www.markdownguide.org/basic-syntax/"
              otherText="Here's a super "
              link="quick primer."
            />
          </Flex>
        </Flex>

        <Flex
          pt={{ base: "24px", lg: "90px" }}
          pl={{ base: "14px", lg: "70px" }}
          justifyContent={"space-between"}
          flexDir={{ base: "column", lg: "row" }}
          gap={10}
          borderWidth={2}
          overflow={"hidden"}
          borderColor={"#D9D9D9"}
          borderRadius={{ base: "12px", lg: "30px 0px 30px 30px" }}
        >
          <Flex
            lineHeight={"135%"}
            flexDir={"column"}
            gap={4}
            pr={{ base: "14px", lg: "0px" }}
            maxW={"386px"}
            color={"#262626"}
            fontSize={{ base: "1rem", xl: "1.75rem" }}
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
            borderWidth={{ base: 0, lg: 2 }}
            borderRight={"0px"}
            borderBottom={"0px"}
            overflow={"hidden"}
            borderColor={"#D9D9D9"}
            width={"100%"}
            borderRadius={"30px 0px 30px 0px"}
            marginBottom={{ base: "-4px", lg: "-4px" }}
          >
            <Box position={"relative"} paddingBottom={"56.2%"}>
              <Image
                src="/home/editing-interface.png"
                alt="authorize github page"
                style={{ objectFit: "contain" }}
                fill
              />
            </Box>
          </Box>
        </Flex>

        <Flex
          pt={{ base: "20px", lg: "90px" }}
          pl={{ base: "20px", lg: "70px" }}
          justifyContent={"space-between"}
          overflow={"hidden"}
          flexDir={{ base: "column", lg: "row" }}
          gap={10}
          borderWidth={2}
          borderColor={"#D9D9D9"}
          borderRadius={{ base: "12px", lg: "30px 0px 30px 30px" }}
        >
          <Flex
            lineHeight={"135%"}
            flexDir={"column"}
            gap={4}
            pr={{ base: "14px", lg: "0px" }}
            maxW={"386px"}
            color={"#262626"}
            fontSize={{ base: "1rem", xl: "1.75rem" }}
            fontFamily={"Polysans"}
          >
            <Text>Here is what will live in the GitHub repository.</Text>
            <Text>
              This is automatically created when you submit your transcript.
            </Text>
          </Flex>
          <Box
            py={{ base: 0, lg: 1 }}
            pl={1}
            borderWidth={{ base: 0, lg: 2 }}
            borderRight={"0px"}
            borderBottom={"0px"}
            width={"100%"}
            borderColor={"#D9D9D9"}
            borderRadius={"30px 0px 30px 0px"}
            marginBottom={{ base: "-4px", lg: "-4px" }}
          >
            <Box position={"relative"} paddingBottom={"56.2%"}>
              <Image
                src="/home/raw-markdown.png"
                alt="authorize github page"
                style={{ objectFit: "contain" }}
                fill
              />
            </Box>
          </Box>
        </Flex>

        <Flex
          pt={{ base: "20px", lg: "90px" }}
          pl={{ base: "20px", lg: "70px" }}
          justifyContent={"space-between"}
          flexDir={{ base: "column", lg: "row" }}
          overflow={"hidden"}
          gap={10}
          borderWidth={2}
          borderColor={"#D9D9D9"}
          borderRadius={{ base: "12px", lg: "30px 0px 30px 30px" }}
        >
          <Flex
            lineHeight={"135%"}
            flexDir={"column"}
            gap={4}
            pr={{ base: "14px", lg: "0px" }}
            maxW={"386px"}
            color={"#262626"}
            fontSize={{ base: "1rem", xl: "1.75rem" }}
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
            borderWidth={{ base: 0, lg: 2 }}
            borderRight={"0px"}
            borderBottom={"0px"}
            width={"100%"} 
            borderColor={"#D9D9D9"}
            borderRadius={"30px 0px 30px 0px"}
          >
            <Box
              position={"relative"}
              paddingBottom={"56.2%"}
              marginBottom={{ base: "-4px", lg: "-4px" }}
            >
              <Image
                src="/home/live-site.png"
                alt="authorize github page"
                style={{ objectFit: "contain" }}
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
