import React from "react";
import StepLayout from "../StepLayout";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import SubStepSingle from "./SubStepSingle";
import Image from "next/image";

const Step2 = () => {
  return (
    <StepLayout
      stepNumber={2}
      heading={`Start reviewing \n and editing the transcript`}
      sub={`TLDR; Use markdown. Make sure stuff is accurate. Use “replace”\n in case of multispeaker transcripts. Use split screen to listen\n and edit transcript at the same time.`}
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
            flexDir={{ base: "column", md: "row" }}
            gap={{ base: "24px", lg: 16 }}
            py={{ base: "22px", lg: "0px" }}
            borderRadius={{ base: "12px", lg: "0px" }}
            px={{ base: "22px", lg: "0px" }}
            borderColor={"#D9D9D9"}
            borderWidth={{ base: 1.5, lg: "0px" }}
            alignItems={{ base: "start", md: "end" }}
          >
            <SubStepSingle
              step={0}
              isBulletList
              setStep={() => false}
              isActive
              heading="Using Markdown"
              activeIcon="/steps-icon/markdown.png"
              inActiveIcon="/steps-icon/markdown.png"
              sub={`We use markdown. This is a way of \n  writing text that tells computers how to \n display information - like what's a title,\n header, what’s bolded, and the like.`}
              maxW="540px"
            />
            <SubStepSingle
              isActive
              isBulletList
              step={0}
              setStep={() => false}
              sub={`You probably won’t need to use anything\n apart from Header 1, Header 2, bolding,\n italics, and hyperlinks.`}
              maxW="536px"
              href="https://www.markdownguide.org/basic-syntax/"
              otherText="Here's a super "
              link="quick primer."
            />
          </Flex>
        </Flex>

        <Flex
          pt={{ base: "20px", md: "45px", "2xl": "90px" }}
          pl={{ base: "20px", md: "35px", "2xl": "70px" }}
          justifyContent={"space-between"}
          flexDir={{ base: "column", md: "row" }}
          gap={10}
          backgroundImage={"/home/dotted-bg.png"}
          backgroundSize={"cover"}
          backgroundRepeat={"no-repeat"}
          backgroundPosition={"center"}
          borderWidth={2}
          overflow={"hidden"}
          borderColor={"#D9D9D9"}
          borderRadius={{ base: "12px", lg: "30px" }}
        >
          <Flex
            lineHeight={"135%"}
            flexDir={"column"}
            gap={4}
            pr={{ base: "14px", lg: "0px" }}
            maxW={"386px"}
            color={"#262626"}
            fontSize={{ base: "0.875rem", lg: "1.27rem", "2xl": "1.75rem" }}
            fontFamily={"Polysans"}
            whiteSpace={"pre-line"}
          >
            <Text>
              Here is what you’ll see as {"\n"}you
              <Text as={"span"}> edit the transcript</Text>
            </Text>
            <Text>
              Notice the use of Header 1, Header 2, and hyperlinks with
              markdown.
            </Text>
          </Flex>
          <Box
            pt={1}
            pl={1}
            borderWidth={{ base: 0, lg: 2 }}
            borderRight={"0px"}
            borderBottom={"0px"}
            overflow={{ base: "unset", lg: "hidden" }}
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
          pt={{ base: "20px", md: "45px", "2xl": "90px" }}
          pl={{ base: "20px", md: "35px", "2xl": "70px" }}
          justifyContent={"space-between"}
          flexDir={{ base: "column", md: "row" }}
          gap={10}
          backgroundImage={"/home/dotted-bg.png"}
          backgroundSize={"cover"}
          backgroundRepeat={"no-repeat"}
          backgroundPosition={"center"}
          borderWidth={2}
          overflow={"hidden"}
          borderColor={"#D9D9D9"}
          borderRadius={{ base: "12px", lg: "30px" }}
        >
          <Flex
            lineHeight={"135%"}
            flexDir={"column"}
            gap={4}
            pr={{ base: "14px", lg: "0px" }}
            width={"100%"}
            maxW={"max-content"}
            color={"#262626"}
            fontSize={{ base: "0.875rem", lg: "1.27rem", "2xl": "1.75rem" }}
            fontFamily={"Polysans"}
          >
            <Text whiteSpace={"pre-line"}>
              Here is what will live in the{`\n`}
              <Link
                isExternal
                textDecoration={"underline"}
                href="https://raw.githubusercontent.com/bitcointranscripts/bitcointranscripts/master/chaincode-labs/chaincode-podcast/2020-11-30-carl-dong-reproducible-builds.md"
              >
                {" "}
                GitHub repository.
              </Link>
            </Text>
            <Text whiteSpace={"pre-line"}>
              This is automatically{"\n"} created when you submit {"\n"} your
              transcript.
            </Text>
          </Flex>
          <Box
            pt={{ base: 0, lg: 1 }}
            pl={1}
            borderWidth={{ base: 0, lg: 2 }}
            borderRight={"0px"}
            borderBottom={"0px"}
            width={"100%"}
            borderColor={"#D9D9D9"}
            borderRadius={"30px 0px 30px 0px"}
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
          pt={{ base: "20px", md: "45px", "2xl": "90px" }}
          pl={{ base: "20px", md: "35px", "2xl": "70px" }}
          justifyContent={"space-between"}
          flexDir={{ base: "column", lg: "row" }}
          overflow={"hidden"}
          backgroundImage={"/home/dotted-bg.png"}
          backgroundSize={"cover"}
          backgroundRepeat={"no-repeat"}
          backgroundPosition={"center"}
          gap={10}
          borderWidth={2}
          borderColor={"#D9D9D9"}
          borderRadius={{ base: "12px", lg: "30px" }}
        >
          <Flex
            lineHeight={"135%"}
            flexDir={"column"}
            gap={4}
            pr={{ base: "14px", lg: "0px" }}
            width={"100%"}
            maxW={"max-content"}
            color={"#262626"}
            fontSize={{ base: "0.875rem", lg: "1.27rem", "2xl": "1.75rem" }}
            fontFamily={"Polysans"}
          >
            <Text whiteSpace={"pre-line"}>
              Here is what will live on the{"\n"}
              <Link
                isExternal
                textDecoration={"underline"}
                href="https://btctranscripts.com/chaincode-labs/2022-04-12-carl-dong-libbitcoinkernel/"
              >
                {" "}
                live site.
              </Link>
            </Text>
            <Text whiteSpace={"pre-line"}>
              This is also automatically {"\n"} created once the review {"\n"}{" "}
              is finalized.
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
