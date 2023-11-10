import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { FC } from "react";

export interface ICarouselCardSlide {
  icon: string;
  heading: string;
  desc: string;
  desc2?: string;
  fullImage?: string;
}
const CarouselCardSlide: FC<ICarouselCardSlide> = ({
  icon,
  heading,
  desc,
  desc2,
  fullImage,
}) => {
  return (
    <Flex
      flexDir={"column"}
      pt={5}
      pl={"14px"}
      minW={"266px"}
      maxW={"266px"}
      minH={"288px"}
      maxH={"288px"}
      justifyContent={"space-between"}
      overflow="hidden"
      borderWidth={1.5}
      borderColor={"#D9D9D9"}
      borderRadius={"12px"}
    >
      <Flex flexDir={"column"} maxW={"222px"} gap={2}>
        <Flex gap={3} fontFamily={"Polysans"}>
          <Image
            src={icon}
            width={16}
            height={16}
            alt="icon"
            style={{ aspectRatio: "1:1", objectFit: "contain" }}
          />
          <Text fontSize={"1.125rem"} fontWeight={700}>
            {heading}
          </Text>
        </Flex>
        <Text
          fontSize={"0.875rem"}
          lineHeight={"130%"}
          fontFamily={"Aeonik Fono"}
        >
          {desc}
        </Text>
        {desc2 && (
          <Text
            fontSize={"0.875rem"}
            lineHeight={"130%"}
            fontFamily={"Aeonik Fono"}
          >
            {desc2}
          </Text>
        )}
      </Flex>

      {fullImage && (
        <Flex justifyContent={"end"} position={"relative"} minHeight={"138px"}>
          <Image
            src={fullImage}
            fill
            alt="test"
            style={{ objectFit: "contain", right: "-30px" }}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default CarouselCardSlide;
