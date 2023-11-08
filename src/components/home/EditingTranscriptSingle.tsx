import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { FC } from "react";

interface IEditingTranscript {
  src: string;
  heading: string;
  sub: string;
}
const EditingTranscriptSingle: FC<IEditingTranscript> = ({
  src,
  heading,
  sub,
}) => {
  return (
    <Flex
      flexDir={"column"}
      maxW={"506px"}
      gap={4}
      px={{ base: "", lg: "44px" }}
      fontFamily={"Polysans"}
      alignItems={{ base: "center", md: "start" }}
    >
      <Image src={src} width={60} height={59} alt={heading} />
      <Text
        fontSize={{
          base: "1.5rem",
          lg: "1.8rem",
          xl: "1.875rem",
          "2xl": "2.5rem",
        }}
        lineHeight={"105%"}
        fontWeight={"semibold"}
      >
        {heading}
      </Text>
      <Text
        fontSize={{
          base: "1rem",
          lg: "1.4rem",
          xl: "1.5rem",
          "2xl": "1.75rem",
        }}
        textAlign={{ base: "center", md: "left" }}
        lineHeight={"125%"}
        fontFamily={"Aeonik Fono"}
      >
        {sub}
      </Text>
    </Flex>
  );
};

export default EditingTranscriptSingle;
