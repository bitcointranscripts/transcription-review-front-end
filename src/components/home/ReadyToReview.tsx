import { Button, Flex, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import React from "react";

const ReadyToReview = () => {
  const getStarted = () => signIn("github");
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
            size={{ base: "md", "2xl": "lg" }}
            maxW={"max-content"}
            bg="#262626"
            borderRadius={["8px", "8px", null]}
            fontFamily={"Mona-Sans"}
            color={"#F7F7F7"}
            onClick={getStarted}
            variant="outline"
            _hover={{}}
            _active={{}}
          >
            Get started for free!
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ReadyToReview;
