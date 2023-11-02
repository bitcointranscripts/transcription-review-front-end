import { Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";

const GreatTranscript = () => {
  return (
    <Flex
      grow={1}
      maxWidth={"765px"}
      width={"100%"}
      borderWidth={3}
      borderRadius={"30px"}
      flexDir={"column"}
      gap={12}
      py="70px"
      px="60px"
      borderColor={"#262626"}
    >
      <Text
        fontSize={"2.25rem"}
        lineHeight={"115%"}
        fontWeight={"bold"}
        color="#333"
      >
        What makes a great transcript?
      </Text>
      <Flex flexDir={"column"} gap={10}>
        <Text
          fontSize={"1.75rem"}
          lineHeight={"135%"}
          letterSpacing={"0.84px"}
          fontWeight={"bold"}
          color="#333"
        >
          A great transcript has the following accurately written:
        </Text>
        <UnorderedList
          lineHeight={"150%"}
          fontSize={"1.225rem"}
          letterSpacing={"0.78px"}
        >
          <ListItem>Title</ListItem>
          <ListItem>Author(s)</ListItem>
          <ListItem>Date of original presentation</ListItem>
          <ListItem>
            Categories (for example, conference, meetup, and the like)
          </ListItem>
          <ListItem>Tags (that is, main topics)</ListItem>
          <ListItem>
            Sections (blocks of conversation that are grouped by a theme)
          </ListItem>
          <ListItem>
            Grammar and spelling (especially technical concepts)
          </ListItem>
          <ListItem>And the use of markdown!</ListItem>
        </UnorderedList>
      </Flex>
      <Flex flexDir={"column"} gap={10}>
        <Text
          fontSize={"1.75rem"}
          lineHeight={"135%"}
          letterSpacing={"0.84px"}
          fontWeight={"bold"}
          color="#333"
        >
          {" "}
          Check out the following transcripts for inspiration:
        </Text>
        <UnorderedList
          lineHeight={"150%"}
          fontSize={"1.225rem"}
          letterSpacing={"0.78px"}
        >
          <ListItem>Silent Payments and Alternatives</ListItem>
          <ListItem>Bitcoin Sidechains - Unchained Epicenter</ListItem>
          <ListItem>Deep Dive Bitcoin Core V0.15</ListItem>
        </UnorderedList>
      </Flex>
    </Flex>
  );
};

export default GreatTranscript;
