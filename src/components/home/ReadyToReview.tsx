import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

const ReadyToReview = ({ getStarted }: { getStarted: () => void }) => {
  return (
    <Flex
      background={"white"}
      py={{ base: 0, lg: 40 }}
      px={{ base: 0, lg: 32 }}
      justifyContent={"center'"}
      align={"center"}
    >
      <Flex
        backgroundImage={"/home/cross-board.png"}
        backgroundSize={"cover"}
        backgroundRepeat={"no-repeat"}
        maxWidth={{ base: "100%", lg: "90%", "2xl": "70%" }}
        margin={{ base: 0, lg: "0 auto" }}
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        minH={"518px"}
      >
        <Flex
          background={{ base: "white", lg: "#F7F7F7" }}
          width={"100%"}
          className="bg-container"
          flexDir={{ base: "column", lg: "row" }}
          borderRadius={{ base: "12px", lg: "50px" }}
          borderWidth={{ base: 1, lg: 2 }}
          fontFamily={"PolySans"}
          px={{ base: "28px", lg: "80px" }}
          py={{ base: "28px", lg: "80px" }}
          justifyContent={"space-between"}
          gap={{ base: "28px", lg: "0px" }}
          alignItems={"center"}
          borderColor={"#CCC"}
        >
          <Text
            maxW={{ base: "360px", lg: "531px" }}
            fontWeight={600}
            textAlign={{ base: "center", lg: "left" }}
            fontSize={{ base: "2rem", xl: "3rem", "2xl": "4.25rem" }}
            lineHeight={"115%"}
          >
            Ready to review transcripts and earn sats?
          </Text>
          <Button
            size={{ base: "md", xl: "lg" }}
            maxW={{ base: "100%", md: "max-content" }}
            bg="#262626"
            borderRadius={{ base: "8px", xl: "12px" }}
            py={{ base: "14px", xl: "28px" }}
            px={{ base: "18px", xl: "36px" }}
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
