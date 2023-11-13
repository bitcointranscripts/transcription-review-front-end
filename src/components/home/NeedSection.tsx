import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import React from "react";
import ThingsNeededSingle from "./ThingsNeededSingle";
import { thingsYouNeed, whyConsiderEdit } from "@/utils";
import Image from "next/image";
import EditingTranscriptSingle from "./EditingTranscriptSingle";

const NeedSection = () => {
  return (
    <Box
      as="section"
      id="need-section"
      py={{ base: "20", lg: "40" }}
      background={"#FAEFE3"}
    >
      <Flex flexDir={"column"} className="bg-container">
        <Flex
          gap={{ base: 10, lg: 4 }}
          flexDir={["column", "column", "column", "column", "row"]}
          justifyContent={"space-between"}
        >
          <Text
            fontSize={{ base: "2.125rem", xl: "3.3rem", "2xl": "3.5rem" }}
            fontFamily={["Polysans"]}
            lineHeight="115%"
            textAlign={{ base: "center", xl: "left" }}
            fontWeight={600}
            maxW={"305px"}
            margin={{ base: "0 auto", lg: "" }}
            minW={["250px"]}
          >
            You only need 3 things:
          </Text>
          <Grid
            gap="42px"
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(3, 1fr)",
            ]}
          >
            {thingsYouNeed.map((thing) => (
              <ThingsNeededSingle key={thing.heading} {...thing} />
            ))}
          </Grid>
        </Flex>
      </Flex>
      <Box
        backgroundImage={"/home/editing-section-bg.png"}
        width={"100%"}
        backgroundSize={"cover"}
        backgroundRepeat={"no-repeat"}
        mt={{ base: 20, lg: 32 }}
      >
        <Flex
          className="bg-container"
          width={"100%"}
          flexDir={{ base: "column", lg: "row" }}
          justifyContent={"space-between"}
          gap="50px"
        >
          <Flex
            width={"100%"}
            gap={{ base: 10, lg: 20 }}
            fontFamily={"Polysans"}
            flexDir={"column"}
            justifyContent={"space-between"}
            maxW={{ base: "100%", lg: "49%" }}
          >
            <Text
              fontSize={{ base: "2.25rem", xl: "3.125rem", "2xl": "4.5rem" }}
              lineHeight={"105%"}
              fontWeight={"semibold"}
              display={{ base: "none", lg: "inline" }}
            >
              But why consider editing transcripts? Well, you’ll...
            </Text>
            <Text
              fontSize={"1.875rem"}
              lineHeight={"105%"}
              fontWeight={"semibold"}
              textAlign={"center"}
              display={{ base: "inline", lg: "none" }}
            >
              But why consider editing transcripts?
            </Text>
            <Box
              position={"relative"}
              minH={{ base: "240px", sm: "340px", lg: "500px", "2xl": "700px" }}
              borderRadius={"20px"}
              overflow={"hidden"}
              w={"100%"}
            >
              <Image
                src="/home/consider-editing.png"
                fill
                alt="editing"
                style={{ objectFit: "cover", aspectRatio: "13:10" }}
              />
            </Box>
            <Text
              fontSize={"1.875rem"}
              lineHeight={"105%"}
              textAlign={"center"}
              fontWeight={"semibold"}
              display={{ base: "inline", lg: "none" }}
            >
              Well you’ll...
            </Text>
          </Flex>
          <Flex flexDir={"column"} gap={{ base: 8, lg: "8", "2xl": "12" }}>
            {whyConsiderEdit.map((reasons) => (
              <EditingTranscriptSingle key={reasons.heading} {...reasons} />
            ))}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default NeedSection;
