import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

const ReadyToReview = ({ getStarted }: { getStarted: () => void }) => {
  return (
    <Flex
      background={"white"}
      py={{ base: 0, lg: 10, "2xl": 20 }}
      px={{ base: 0 }}
      className="bg-container"
      justifyContent={"center'"}
      align={"center"}
    >
      <Flex
        backgroundImage={"/home/cross-board.png"}
        backgroundSize={"cover"}
        backgroundRepeat={"no-repeat"}
        maxWidth={{ base: "100%", lg: "90%", "2xl": "100%" }}
        margin={{ base: 0, lg: "0 auto" }}
        width={"100%"}
        px={{ base: "28px", lg: "32px", xl: "58px", "2xl": "80px" }}
        py={{ base: "28px", lg: "32px", xl: "58px", "2xl": "80px" }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Flex
          background={{ base: "white", lg: "#F7F7F7" }}
          width={"100%"}
          className="bg-container"
          flexDir={{ base: "column", md: "row" }}
          borderRadius={{ base: "12px", lg: "32px", xl: "42px", "2xl": "50px" }}
          borderWidth={{ base: 1, lg: 2 }}
          fontFamily={"PolySans"}
          px={{ base: "28px", lg: "32px", xl: "58px", "2xl": "80px" }}
          py={{ base: "28px", lg: "32px", xl: "58px", "2xl": "80px" }}
          justifyContent={"space-between"}
          gap={{ base: "28px", lg: "0px" }}
          alignItems={"center"}
          borderColor={"#CCC"}
        >
          <Text
            maxW={{ base: "360px", lg: "531px" }}
            fontWeight={600}
            textAlign={{ base: "center", md: "left" }}
            fontSize={{
              base: "1.25rem",
              lg: "2.1rem",
              xl: "3rem",
              "3xl": "4.25rem",
            }}
            lineHeight={"115%"}
            whiteSpace={"pre-line"}
          >
            Ready to review {"\n"} transcripts {"\n"} and earn sats?
          </Text>
          <Button
            maxW={{ base: "100%", md: "max-content" }}
            bg="#262626"
            borderRadius={{ base: "8px", xl: "12px" }}
            py={{ base: "14px", lg: "28px", xl: "32px", "2xl": "36px" }}
            px={{ base: "18px", lg: "28px", xl: "32px", "2xl": "36px" }}
            fontSize={{ base: "", lg:"24px", "2xl": "30px" }}
            color={"#F7F7F7"}
            variant="outline"
            onClick={getStarted}
            _hover={{ backgroundColor: "orange" }}
            _active={{}}
          >
            Get Started
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ReadyToReview;
