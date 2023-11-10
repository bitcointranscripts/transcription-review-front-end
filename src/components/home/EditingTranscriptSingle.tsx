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
    <Flex flexDir={"column"} maxW={"506px"} gap={4} px="44px">
      <Image src={src} width={80} height={79} alt={heading} />
      <Text fontSize={"2.5rem"} lineHeight={"105%"} fontWeight={"semibold"}>
        {heading}
      </Text>
      <Text fontSize={"1.75rem"} lineHeight={"125%"}>
        {sub}
      </Text>
    </Flex>
  );
};

export default EditingTranscriptSingle;
