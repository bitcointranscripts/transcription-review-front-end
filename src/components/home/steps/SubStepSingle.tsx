import { Flex, Link, Text, Image } from "@chakra-ui/react";
import React, { FC } from "react";

interface ISubStepSingle {
  heading?: string;
  isActive?: boolean;
  boldString?: string;
  sub: string;
  maxW: string;
  link?: string;
  otherText?: string;
  href?: string;
  activeIcon?: string;
  inActiveIcon?: string;
}
const SubStepSingle: FC<ISubStepSingle> = ({
  isActive,
  heading,
  boldString,
  sub,
  otherText,
  link,
  href,
  maxW,
  inActiveIcon,
  activeIcon,
}) => {
  return (
    <Flex
      flexDir={"column"}
      width={"100%"}
      gap={{ base: 4, lg: 6 }}
      maxW={maxW}
    >
      {heading && (
        <Flex gap={{ base: 3, lg: 4 }} alignItems={"center"}>
          {activeIcon && inActiveIcon && (
            <Image
              objectFit={"contain"}
              width={"30px"}
              src={isActive ? activeIcon : inActiveIcon}
              alt={heading}
            />
          )}
          <Text
            fontFamily={"Polysans"}
            color={isActive ? "#333" : "#A6A6A6"}
            fontSize={{ base: "1.125rem", xl: "1.5rem", "2xl": "1.5rem" }}
            fontWeight={700}
          >
            {heading || ""} <Text as="span">{boldString || ""}</Text>
          </Text>
        </Flex>
      )}
      <Text
        fontFamily={"Aeonik Fono"}
        color={isActive ? "#333" : "#A6A6A6"}
        fontSize={{ base: "0.875rem", xl: "1.5rem", "2xl": "1.5rem" }}
      >
        {sub} <br />
        {link && (
          <Text as={"span"}>
            {otherText}
            <Link
              href={href}
              isExternal
              textDecoration={"underline"}
              fontFamily={"Aeonik Fono"}
              color={isActive ? "#333" : "#A6A6A6"}
              fontSize={{ base: "0.875rem", xl: "1.5rem", "2xl": "1.5rem" }}
            >
              {link}
            </Link>
          </Text>
        )}
      </Text>
    </Flex>
  );
};

export default SubStepSingle;
