import { Flex, Image, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";

const OptimalSetup = () => {
  return (
    <Flex
      maxWidth={{ lg: "500px", xl: "765px" }}
      width={"100%"}
      borderWidth={3}
      borderRadius={{ base: "12px", lg: "30px" }}
      flexDir={"column"}
      gap={{ base: 5, lg: 5 }}
      justifyContent={"space-between"}
      py={{ base: "24px", xl: "50px", "2xl": "70px" }}
      px={{ base: "24px", xl: "43px", "2xl": "60px" }}
      borderColor={"#262626"}
    >
      <Flex flexDir={"column"} gap={{ base: 5, lg: 6, "2xl": 12 }}>
        <Text
          fontSize={{
            base: "1.2rem",
            lg: "1.6rem",
            xl: "2.31rem",
            "2xl": "3.25rem",
          }}
          lineHeight={"115%"}
          fontWeight={"bold"}
          color="#333"
        >
          Tips for an optimal setup
        </Text>
        <Flex flexDir={"column"} fontFamily={"Aeonik Fono"}>
          <UnorderedList
            lineHeight={"150%"}
            fontSize={{ base: "0.875rem", lg: "1.21rem", "2xl": "1.625rem" }}
            letterSpacing={"0.78px"}
            display={"flex"}
            paddingX={2}
            flexDir={"column"}
            gap={{ base: 3, "2xl": 8 }}
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
