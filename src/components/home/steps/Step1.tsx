import React, { useEffect, useState } from "react";
import StepLayout from "../StepLayout";
import { Box, Flex, Text } from "@chakra-ui/react";
import SubStepSingle from "./SubStepSingle";
import Image from "next/image";
import CarouselCards from "../CarouselCards";
import { ICarouselCardSlide } from "../CarouselCardSlide";

const Step1 = () => {
  const images = ["/home/authorize-landing.png", "/home/raw-markdown.png"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const step1Contents: ICarouselCardSlide[] = [
    {
      fullImage: "/home/signin-github.png",
      heading: "Connect",
      icon: "/home/connect.png",
      desc: "Connect your GitHub account to BTCTranscripts by clicking “Get Started”",
    },
    {
      fullImage: "/home/authorize-mobile.png",
      heading: "Authorize",
      icon: "/home/authorize-step.png",
      desc: "Authorize Bitcoin Transcripts Dev to access to your Github account",
      desc2:
        "In simple English, it means that BTCTranscripts will write your transcript onto GitHub so that it can be reviewed.",
    },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Change slide every 3 seconds (3000 milliseconds)

    return () => {
      clearInterval(interval);
    };
  });
  return (
    <StepLayout
      stepNumber={1}
      heading="Claim a recording to review"
      sub="TLDR; Connect your GitHub to BTCtranscripts"
    >
      <Flex flexDir={"column"} gap={10}>
        {/* <Flex></Flex> */}
        <Box display={{ base: "block", md: "none" }}>
          <CarouselCards stepContents={step1Contents} />
        </Box>

        <Flex
          pt={"70px"}
          px="70px"
          display={{ base: "none", md: "flex" }}
          flexDir={"column"}
          borderWidth={2}
          gap={20}
          width="100%"
          borderColor={"#D9D9D9"}
          borderRadius={"30px 0px 30px 30px"}
        >
          <Flex
            gap={10}
            flexDir={{ base: "column", lg: "row" }}
            flexWrap={{ base: "wrap", xl: "nowrap" }}
          >
            <SubStepSingle
              isActive={currentIndex === 0}
              heading="Connect"
              sub="Connect your GitHub account to BTCTranscripts by clicking “Sign In”"
              maxW="332px"
            />
            <SubStepSingle
              isActive={currentIndex === 1}
              heading="Authorize"
              sub="Authorize Bitcoin Transcripts Dev to access to your aassoiants account"
              maxW="332px"
            />
            <SubStepSingle
              sub="In simple English, it means that BTCTranscripts will write your transcript onto GitHub so that it can be reviewed."
              maxW="412px"
            />
          </Flex>
          <Box
            p={2}
            borderWidth={2}
            className="slideshow"
            borderColor={"#D9D9D9"}
            maxW={["85%"]}
            borderRadius={"30px 30px 30px 30px"}
          >
            {images.map((image, index) => (
              <Box
                className={`slides ${
                  index === currentIndex ? "active" : "hidden"
                } `}
                minH={"400px"}
                width={"100%"}
                position={"relative"}
                marginBottom={"-7px"}
                key={image}
              >
                <Image
                  src={image}
                  alt="authorize github page"
                  fill
                  style={{
                    borderRadius: "30px 30px 0px 0px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Flex>

        <Flex
          pt={{ base: "20px", lg: "90px" }}
          pl={{ base: "20px", lg: "70px" }}
          justifyContent={"space-between"}
          gap={10}
          flexDir={{ base: "column", lg: "row" }}
          borderWidth={2}
          borderColor={"#D9D9D9"}
          borderRadius={{
            base: "12px 0px 12px 12px",
            lg: "30px 30px 30px 30px",
          }}
        >
          <Flex
            lineHeight={"135%"}
            flexDir={"column"}
            fontSize={{ base: "0.875rem", xl: "1.75rem" }}
            fontFamily={"Aeonik Fono"}
            gap={4}
            maxW={"386px"}
          >
            <Text>
              Once signed in, find a transcript that catches your fancy, and
              click “Claim.”
            </Text>
            <Text>Now, it’s time to edit!</Text>
          </Flex>
          <Box
            py={{ base: 0, lg: 1 }}
            pl={{ base: 0, lg: 1 }}
            borderWidth={{ base: 0, lg: 2 }}
            width={"100%"}
            borderColor={"#D9D9D9"}
            borderRadius={{
              base: "12px 0px 12px 12px",
              lg: "30px 0px 30px 0px",
            }}
          >
            <Box
              position={"relative"}
              marginBottom={{ base: "0px", lg: "-10px" }}
              minH={{ base: "120px", lg: "346px" }}
              overflow={"hidden"}
            >
              <Image
                src="/home/claim-transcript.png"
                alt="authorize github page"
                style={{
                  objectFit: "contain",
                  aspectRatio: "16:9",
                  bottom: "0px",
                }}
                fill
              />
            </Box>
          </Box>
        </Flex>
      </Flex>
    </StepLayout>
  );
};

export default Step1;
