import React from "react";
import StepLayout from "../StepLayout";
import { Box, Flex, Text } from "@chakra-ui/react";
import SubStepSingle from "./SubStepSingle";
import Image from "next/image";

const Step3 = () => {
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
              heading="Submission"
              sub="Once you submit your transcript, it will create a PR (pull request)* of your edited transcript from the original transcript"
              maxW="528px"
            />
            <SubStepSingle
              heading="Check the PR"
              sub="If you want to see your transcript, visit your profile and click the link. On the transcript’s GitHub PR, you can click the “Files changed” nav button to view."
              maxW="660px"
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
          py={"70px"}
          pl="70px"
          justifyContent={"space-between"}
          gap={10}
          borderWidth={2}
          borderColor={"#D9D9D9"}
          borderRadius={"30px 0px 30px 30px"}
        >
          <Text>
            <Text as={"span"}>*Nerd stuff:</Text> Pull Requests (also called PRs
            or merge requests) inform others that you’re making a change from an
            original piece of code. The transcript text is technically code
            because it’s what the live site uses. The original code was the
            transcript before you made the edits. So, you “pulled” that code and
            are requesting your new, edited code to be used instead.
          </Text>
        </Flex>

        <Flex
          py={"70px"}
          pl="70px"
          justifyContent={"space-between"}
          gap={10}
          borderWidth={2}
          borderColor={"#D9D9D9"}
          borderRadius={"30px 0px 30px 30px"}
        >
          <Flex flexDir={"column"} gap={8}>
            <Text>
              After Submission: Your edited code or transcript will be reviewed
              by a human.
            </Text>
            <Text>
              Once approved, it will be published. If it&apos;s not accepted,
              you can make further changes through GitHub conversations.
            </Text>
            <Text>
              After publication, you&apos;ll receive Sats in your account wallet
              as a token of appreciation, which you can withdraw to your
              preferred Lightning wallet.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </StepLayout>
  );
};

export default Step3;
