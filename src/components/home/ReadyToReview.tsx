import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

const ReadyToReview = () => {
  return (
    <Flex
      background={"white"}
      py={40}
      px={32}
      justifyContent={"center'"}
      align={"center"}
    >
      <Flex
        backgroundImage={"/home/cross-board.png"}
        backgroundSize={"cover"}
        backgroundRepeat={"no-repeat"}
        className="bg-container"
        justifyContent={"center"}
        alignItems={"center"}
        minH={["518px"]}
      >
        <Flex
          background={"#F7F7F7"}
          width={"100%"}
          maxW={"85%"}
          borderRadius={"50px"}
          borderWidth={2}
          fontFamily={"PolySans"}
          //   maxWidth={"531px"}
          px={"80px"}
          py={"80px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          borderColor={"#CCC"}
        >
          <Text
            maxW={"360px"}
            fontWeight={600}
            fontSize={{ base: "3.25rem", xl: "3rem", "2xl": "4.25rem" }}
            lineHeight={"115%"}
          >
            Ready to review transcripts and earn sats?
          </Text>
          <Button
            size={{ base: "md", "2xl": "lg" }}
            maxW={"max-content"}
            bg="#262626"
            fontFamily={"Mona-Sans"}
            color={"#F7F7F7"}
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
