import { Button, Flex, ListItem, OrderedList, Text } from "@chakra-ui/react";
import React from "react";
import BTCLogo from "./BTCLogo";
import Image from "next/image";

const HeroSection = () => {
  return (
    <Flex
      className="hero-section"
      flexDir={"column"}
      pl={"100px"}
      pt={"45px"}
      width={"100%"}
    >
      <BTCLogo />
      <Flex mt="80px" justifyContent={"space-between"} pb="20">
        <Flex maxW={"50%"} gap="48px" flexDir={"column"} w={"full"}>
          <Text fontSize={"4.25rem"} fontWeight={600} lineHeight={"105%"}>
            <Text color={"#F7931A"} as={"span"}>
              Review
            </Text>{" "}
            Technical Bitcoin Transcripts and
            <Text color={"#F7931A"} as={"span"}>
              {" "}
              Earn Sats
            </Text>
          </Text>
          <Flex gap="10" flexDir={"column"}>
            <Text fontSize={"1.25rem"}>Get started in 3 simple steps:</Text>
            <OrderedList>
              <ListItem>Register and claim a talk</ListItem>
              <ListItem>Review and edit the transcript</ListItem>
              <ListItem>Submit and earn sats</ListItem>
            </OrderedList>
          </Flex>
          <Flex gap={"8"}>
            <Button
              size="md"
              maxW={"max-content"}
              bg="#262626"
              color={"#F7F7F7"}
              variant="outline"
            >
              Get Started
            </Button>

            <Button
              size="md"
              maxW={"max-content"}
              colorScheme="dark"
              variant="outline"
            >
              Tell me more
            </Button>
          </Flex>
        </Flex>
        <Flex maxW={"49%"} w={"100%"} justifyContent={"end"} cursor={"pointer"}>
          <Image
            src={"/home/hero-thumbnail.png"}
            width={552}
            height={252}
            alt="BTC Youtube"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HeroSection;
