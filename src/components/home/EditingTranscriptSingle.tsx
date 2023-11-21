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
      maxW={{ base: "506px", lg: "500px", xl: "506px", "3xl": "max-content" }}
      whiteSpace={"pre-line"}
      margin={{ base: "0 auto", lg: "unset" }}
      gap={{ base: 4, lg: 2, xl: 4 }}
      px={{ base: "", lg: "32px", "2xl": "44px" }}
      fontFamily={"Polysans"}
      alignItems={{ base: "center", lg: "start" }}
    >
      <Image src={src} width={60} height={59} alt={heading} />
      <Text
        fontSize={{
          base: "1.5rem",
          lg: "1.25rem",
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
          lg: "1rem",
          xl: "1.4rem",
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
