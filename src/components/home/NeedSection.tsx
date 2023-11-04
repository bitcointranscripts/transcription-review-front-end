import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import React from "react";
import ThingsNeededSingle from "./ThingsNeededSingle";
import { thingsYouNeed, whyConsiderEdit } from "@/utils";
import Image from "next/image";
import EditingTranscriptSingle from "./EditingTranscriptSingle";

const NeedSection = () => {
  return (
    <Box as="section" py={"40"} background={"#FAEFE3"}>
      <Flex flexDir={"column"} className="bg-container">
        <Flex
          gap="4"
          flexDir={["column", "column", "column", "column", "row"]}
          justifyContent={"space-between"}
        >
          <Text
            fontSize={{ base: "2.5rem", "2xl": "4.5rem" }}
            fontFamily={["Polysans"]}
            lineHeight="115%"
            fontWeight={600}
            maxW={"305px"}
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
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
          >
            {thingsYouNeed.map((thing) => (
              <ThingsNeededSingle key={thing.heading} {...thing} />
            ))}
          </Grid>
        </Flex>
      </Flex>
      {/*  */}
      <Box
        backgroundImage={"/home/editing-section-bg.png"}
        width={"100%"}
        backgroundSize={"cover"}
        backgroundRepeat={"no-repeat"}
        mt={32}
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
            gap={20}
            flexDir={"column"}
            justifyContent={"space-between"}
            maxW={{ base: "100%", lg: "49%" }}
          >
            <Text
              fontSize={{ base: "2.25rem", xl: "3rem", "2xl": "4.5rem" }}
              lineHeight={"105%"}
              fontWeight={"semibold"}
            >
              But why consider editing transcripts? Well, you’ll...
            </Text>
            <Box
              position={"relative"}
              minH={{ base: "400px", lg: "500px", "2xl": "700px" }}
              borderRadius={"20px"}
              w={"100%"}
            >
              <Image
                src="/home/editing-section.png"
                fill
                alt="editing"
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Flex>

          {/*  */}
          <Flex flexDir={"column"} gap={"12"}>
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
