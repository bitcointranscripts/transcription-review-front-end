import { Flex, Link, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";

const GreatTranscript = () => {
  return (
    <Flex
      maxWidth={{ lg: "500px", xl: "765px" }}
      width={"100%"}
      borderWidth={3}
      borderRadius={{ base: "12px", lg: "30px" }}
      flexDir={"column"}
      gap={{ base: 5, lg: 12 }}
      py={{ base: "24px", xl: "70px" }}
      px={{ base: "24px", xl: "60px" }}
      borderColor={"#262626"}
    >
      <Text
        fontSize={{
          base: "1.2rem",
          lg: "2.25rem",
          xl: "2.35rem",
          "2xl": "3.25rem",
        }}
        lineHeight={"115%"}
        fontWeight={"bold"}
        color="#333"
      >
        What makes a great transcript?
      </Text>
      <Flex
        flexDir={"column"}
        gap={{ base: 5, lg: 10 }}
        fontFamily={"Aeonik Fono"}
      >
        <Text
          fontSize={{
            base: "0.875rem",
            xl: "1.31rem",
            "2xl": "1.75rem",
          }}
          lineHeight={"135%"}
          letterSpacing={"0.84px"}
          fontWeight={"bold"}
          color="#333"
        >
          A great transcript has the following accurately written:
        </Text>
        <UnorderedList
          lineHeight={"150%"}
          fontSize={{ base: "0.875rem", lg: "1.21rem", "2xl": "1.75rem" }}
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
      <Flex
        flexDir={"column"}
        gap={{ base: 5, lg: 10 }}
        fontFamily={"Aeonik Fono"}
      >
        <Text
          fontSize={{
            base: "0.875rem",
            xl: "1.31rem",
            "2xl": "1.75rem",
          }}
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
          fontSize={{ base: "0.875rem", lg: "1.21rem", "2xl": "1.75rem" }}
          letterSpacing={"0.78px"}
        >
          <ListItem textDecoration={"underline"}>
            <Link
              as={"a"}
              target="_blank"
              href="https://btctranscripts.com/tabconf/2022/2022-10-15-silent-payments/"
            >
              Silent Payments and Alternatives
            </Link>
          </ListItem>
          <ListItem textDecoration={"underline"}>
            <Link
              as={"a"}
              target="_blank"
              href="https://btctranscripts.com/misc/bitcoin-sidechains-unchained-epicenter-adam3us-gmaxwell/"
            >
              Bitcoin Sidechains - Unchained Epicenter
            </Link>
          </ListItem>
          <ListItem textDecoration={"underline"}>
            <Link
              as={"a"}
              target="_blank"
              href="https://btctranscripts.com/greg-maxwell/2017-08-28-gmaxwell-deep-dive-bitcoin-core-v0.15/"
            >
              Deep Dive Bitcoin Core V0.15
            </Link>
          </ListItem>
        </UnorderedList>
      </Flex>
    </Flex>
  );
};

export default GreatTranscript;
