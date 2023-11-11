import {
  Button,
  Flex,
  ListItem,
  OrderedList,
  Text,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import BTCLogo from "./BTCLogo";
import LearnHowText from "../svgs/LearnHow";
import YoutubeTutorial from "./Youtube";
import LearnHowMobile from "../svgs/LearnHowMobile";
import ArrowUp from "../svgs/ArrowUp";
import { signIn } from "next-auth/react";
import ArrowDown from "../svgs/ArrowDown";

const HeroSection = () => {
  const getStarted = () => signIn("github");
  const [moreHover, setMoreHover] = useState(false);
  return (
    <Flex
      className="hero-section "
      flexDir={"column"}
      width={"100%"}
      id="hero-section"
      position={"relative"}
    >
      <Flex
        position={{ base: "fixed", lg: "relative" }}
        bg={{ base: "white", lg: "transparent" }}
        w={"full"}
        zIndex={90}
      >
        <Flex
          pl={{ base: "24px", md: "32px", xl: "100px" }}
          pr={{ base: "24px", md: "32px", lg: "0px" }}
          position={"relative"}
          pt={{ base: "0px", lg: "45px" }}
          mt={{ base: "0px", lg: "45px" }}
          py={{ base: "16px", lg: "0px" }}
          width={"100%"}
          boxShadow={{
            base: "0px 5px 10px 0px rgba(0, 0, 0, 0.07)",
            lg: "none",
          }}
          justifyContent={"space-between"}
        >
          <BTCLogo />
          <Box
            position={"absolute"}
            display={{ base: "none", lg: "block" }}
            top={{ lg: "-15px", xl: "-30px" }}
            right={{ lg: "0px", xl: "50px" }}
          >
            <LearnHowText />
          </Box>
          <Box
            as="a"
            href="#hero-section"
            display={{ base: "block", lg: "none" }}
          >
            <ArrowUp />
          </Box>
        </Flex>
      </Flex>
      <Flex
        mt={{ base: "80px", lg: "40px" }}
        pl={{ base: "24px", md: "32px", xl: "100px" }}
        pr={{ base: "24px", md: "32px", lg: "0px" }}
        pt={{ base: "0px", lg: "45px" }}
        flexDir={["column", "column", "column", "row"]}
        justifyContent={"space-between"}
        gap={[20, 20, 20, 4]}
        pb={{ base: 8, lg: "20" }}
      >
        <Flex
          maxW={["100%", "100%", "100%", "49%", "49%"]}
          gap={{ base: "28px", lg: "48px" }}
          flexDir={"column"}
          w={"full"}
        >
          <Text
            fontFamily={"Polysans"}
            fontSize={{
              base: "2.12rem",
              md: "3.25rem",
              lg: "3.1rem",
              xl: "4rem",
              "2xl": "4.5rem",
              "3xl": "5rem",
            }}
            fontWeight={600}
            lineHeight={["130%", "105%"]}
          >
            <Text color={"#F7931A"} as={"span"}>
              Review
            </Text>{" "}
            Technical Bitcoin Transcripts and
            <Text color={"#F7931A"} as={"span"}>
              {" "}
              Earn Sats
            </Text>
          </Text>
          <Flex
            gap={{ base: 2, lg: 5 }}
            fontSize={{
              base: "1rem",
              lg: "1.5rem",
              xl: "2rem",
              "2xl": "2.5rem",
              "3xl": "3rem",
            }}
            flexDir={"column"}
            fontFamily={"Aeonik Fono"}
          >
            <Text>Get started in 3 simple steps:</Text>
            <OrderedList>
              <ListItem>
                Register and{" "}
                <Text fontWeight={700} as={"span"}>
                  claim
                </Text>{" "}
                a talk
              </ListItem>
              <ListItem>
                Review and{" "}
                <Text fontWeight={700} as={"span"}>
                  edit
                </Text>{" "}
                the transcript
              </ListItem>
              <ListItem>
                Submit and{" "}
                <Text fontWeight={700} as={"span"}>
                  earn
                </Text>{" "}
                sats
              </ListItem>
            </OrderedList>
          </Flex>
          <Flex
            flexDir={["column", "row"]}
            gap={{ base: 4, md: 8 }}
            fontFamily={"Mona-sans"}
            alignItems={"stretch"}
          >
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

            <Button
              as={"a"}
              href="#need-section"
              size={{ base: "md", xl: "lg", "2xl": "lg" }}
              maxW={{ base: "100%", md: "max-content" }}
              borderRadius={{ base: "8px", xl: "12px" }}
              borderWidth={{ base: 1.2, lg: 2, xl: 3 }}
              borderColor={"#262626"}
              py={{ base: "", xl: "25px" }}
              px={{ base: "", xl: "36px" }}
              colorScheme="dark"
              variant="outline"
              className="animated-button"
              onMouseEnter={() => setMoreHover(true)}
              onMouseLeave={() => setMoreHover(false)}
              rightIcon={moreHover ? <ArrowDown /> : <></>}
            >
              Tell me more
            </Button>
          </Flex>
        </Flex>
        <Flex
          maxW={["100%", "100%", "100%", "49%"]}
          w={"100%"}
          justifyContent={"end"}
          alignItems={"center"}
          cursor={"pointer"}
          position={"relative"}
          gap={4}
          flexDir={{ base: "column", lg: "row" }}
        >
          <Box display={{ base: "block", lg: "none" }}>
            <LearnHowMobile />
          </Box>
          <YoutubeTutorial />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HeroSection;
