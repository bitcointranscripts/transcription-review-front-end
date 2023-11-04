import {
  Button,
  Flex,
  ListItem,
  OrderedList,
  Text,
  Image,
} from "@chakra-ui/react";
import React from "react";
import BTCLogo from "./BTCLogo";
// import Image from "next/image";

const HeroSection = () => {
  return (
    <Flex
      className="hero-section"
      flexDir={"column"}
      pl={{ base: "24px", md: "32px", xl: "100px" }}
      pr={{ base: "24px", md: "32px", xl: "0px" }}
      pt={"45px"}
      width={"100%"}
    >
      <BTCLogo />
      <Flex
        mt="80px"
        flexDir={["column", "column", "column", "row"]}
        justifyContent={"space-between"}
        gap={[20, 20, 20, 4]}
        pb="20"
      >
        <Flex
          maxW={["100%", "100%", "100%", "50%"]}
          gap="48px"
          flexDir={"column"}
          w={"full"}
        >
          <Text
            fontFamily={"Polysans"}
            fontSize={{ base: "2.2rem", lg: "4.25rem", "2xl": "6.25rem" }}
            fontWeight={600}
            lineHeight={["130%", "105%"]}
          >
            <Text color={"#F7931A"} as={"span"}>
              Review
            </Text>{" "}
            Technical Bitcoin Transcripts and
            <Text color={"#F7931A"} as={"span"}>
              {" "}
              Earn Sats
            </Text>
          </Text>
          <Flex
            gap={5}
            fontSize={["1.25rem", "", "", "", "", "2.25rem"]}
            flexDir={"column"}
            fontFamily={"Aeonik Fono"}
          >
            <Text>Get started in 3 simple steps:</Text>
            <OrderedList>
              <ListItem>Register and claim a talk</ListItem>
              <ListItem>Review and edit the transcript</ListItem>
              <ListItem>Submit and earn sats</ListItem>
            </OrderedList>
          </Flex>
          <Flex gap={"8"} fontFamily={"Mona-sans"}>
            <Button
              size={["md", "md", "md", "md", "md", "lg"]}
              maxW={"max-content"}
              bg="#262626"
              color={"#F7F7F7"}
              variant="outline"
              _hover={{}}
              _active={{}}
            >
              Get Started
            </Button>

            <Button
              size={["md", "md", "md", "md", "md", "lg"]}
              maxW={"max-content"}
              colorScheme="dark"
              variant="outline"
            >
              Tell me more
            </Button>
          </Flex>
        </Flex>
        <Flex
          maxW={["100%", "100%", "100%", "49%"]}
          w={"100%"}
          justifyContent={"end"}
          cursor={"pointer"}
        >
          <Flex
            maxW={"100%"}
            justifyContent={"end"}
            alignItems={"start"}
            w={"100%"}
            position={"relative"}
          >
            <Image
              src={"/home/hero-thumbnail.png"}
              style={{
                objectFit: "contain",
                borderRadius: "30px 0px 0px 30px",
                right: "0px",
              }}
              alt="BTC Youtube"
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HeroSection;
