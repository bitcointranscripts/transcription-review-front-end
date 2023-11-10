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
        <Flex gap="4" justifyContent={"space-between"}>
          <Text
            fontSize={"4.5rem"}
            lineHeight="115%"
            fontWeight={600}
            maxW={"305px"}
          >
            You only need 3 things:
          </Text>
          <Grid gap="42px" templateColumns="repeat(3, 1fr)">
            {thingsYouNeed.map((thing) => (
              <ThingsNeededSingle key={thing.heading} {...thing} />
            ))}
          </Grid>
        </Flex>
      </Flex>
      {/*  */}
      <Box className="bg-container" mt={32}>
        <Flex width={"100%"} justifyContent={"space-between"} gap="50px"> 
          <Flex width={"100%"} gap={20} flexDir={"column"} maxW={"49%"}>
            <Text
              fontSize={"3.25rem"}
              lineHeight={"105%"}
              fontWeight={"semibold"}
            >
              But why consider editing transcripts? Well, you’ll...
            </Text>
            <Box
              position={"relative"}
              minH={"700px"}
              borderRadius={"20px"}
              w={"100%"}
            >
              <Image
                src="/home/editing-section.png"
                objectFit="cover"
                fill
                alt="editing"
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
