import { Flex, Link, Text, Image } from "@chakra-ui/react";
import React, { FC, SetStateAction } from "react";

interface ISubStepSingle {
  heading?: string;
  setStep: React.Dispatch<SetStateAction<number>>;
  step: number;
  isBulletList?: boolean;
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
  step,
  isBulletList,
  setStep,
}) => {
  const handleClick = () => setStep(step);

  return (
    <Flex
      as={isBulletList ? "ul" : Flex}
      flexDir={"column"}
      width={"100%"}
      gap={2}
      maxW={maxW}
      cursor={"pointer"}
      onClick={handleClick}
    >
      <Flex gap={{ base: 2, "2xl": 4 }} alignItems={"center"}>
        {activeIcon && inActiveIcon && (
          <Image
            objectFit={"contain"}
            width={{ base: "20px", "2xl": "30px" }}
            src={isActive ? activeIcon : inActiveIcon}
            alt={heading}
          />
        )}
        <Text
          fontFamily={"Polysans"}
          color={isActive ? "#333" : "#A6A6A6"}
          fontSize={{ base: "1.125rem", lg: "1.125rem", "2xl": "1.5rem" }}
          fontWeight={700}
        >
          {heading || ""} <Text as="span">{boldString || ""}</Text>
        </Text>
      </Flex>{" "}
      <Text
        fontFamily={"Aeonik Fono"}
        as={isBulletList ? "li" : Text}
        marginLeft={isBulletList ? "16px" : "0px"}
        color={isActive ? "#333" : "#A6A6A6"}
        whiteSpace={"pre-line"}
        fontSize={{
          base: "0.65rem",
          sm: "0.875rem",
          lg: "1.12rem",
          "2xl": "1.5rem",
        }}
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
              fontSize={{
                base: "0.65rem",
                sm: "0.875rem",
                lg: "1.12rem",
                "2xl": "1.5rem",
              }}
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
