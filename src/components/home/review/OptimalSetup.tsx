import { Flex, Image, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";

const OptimalSetup = () => {
  return (
    <Flex
      maxWidth={" 765px"}
      width={"100%"}
      borderWidth={3}
      borderRadius={"30px"}
      flexDir={"column"}
      justifyContent={"space-between"}
      py="70px"
      px="60px"
      borderColor={"#262626"}
    >
      <Flex flexDir={"column"} gap={12}>
        <Text
          fontSize={"2.25rem"}
          lineHeight={"115%"}
          fontWeight={"bold"}
          color="#333"
        >
          Tips for an optimal setup
        </Text>
        <Flex flexDir={"column"}>
          <UnorderedList
            lineHeight={"150%"}
            fontSize={"1.225rem"}
            letterSpacing={"0.78px"}
            display={"flex"}
            flexDir={"column"}
            gap={10}
          >
            <ListItem>
              An ideal setup is using split screen to make edits while listening
              live to the original recording
            </ListItem>
            <ListItem>
              You can find the original recording by clicking the “Source”
              button
            </ListItem>
            <ListItem>
              For transcripts with multiple speakers, there should be speaker
              labels (e.g. &quot;speaker 0:&quot; or &quot;speaker 2:&quot;).
              Use search-and-replace to label the speakers with the proper
              names.
            </ListItem>
          </UnorderedList>
        </Flex>
      </Flex>
      <Image src="/home/split-screen.png" alt="" />
    </Flex>
  );
};

export default OptimalSetup;
