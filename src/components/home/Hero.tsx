import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { YouTubePlayer } from "react-youtube";
import React from "react";
import GlobalContainer from "../GlobalContainer";

const Hero = ({
  getStarted,
  youtube,
  setModalInfo,
}: {
  getStarted: () => void;
  youtube?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  setModalInfo: any;
}) => {
  const openYoutubePlayer = () => {
    setModalInfo({ visible: true });
  };
  const openAccordion = ()=>{
    setModalInfo({ visible: false, accordionStep: 1 });
  }
  return (
    <Box bgColor="gray.100" width={"100%"}>
      <GlobalContainer py={4}>
        <Flex direction={{ base: "column", sm: "row" }} gap={4}>
          <Flex flex="1 1 50%" gap={4} direction="column" justifyContent="left">
            <Heading
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              letterSpacing="0.08ch"
              color="gray.800"
              textShadow="dark-lg"
            >
              To review technical Bitcoin talk transcripts
            </Heading>
            <Box
              as="ul"
              mt={4}
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              fontWeight={500}
              style={{ listStyle: "none" }}
              color="gray.500"
            >
              <li>
                <Text>Step 1: Create account + claim recording</Text>
              </li>
              <li>
                <Text>Step 2: Review & edit transcript</Text>
              </li>
              <li>
                <Text>Step 3: Submit (and earn 🤑)</Text>
              </li>
            </Box>
            <Flex alignItems={"center"} mt={4} gap={4}>
              <Button
                onClick={openYoutubePlayer}
                variant="solid"
                colorScheme="blue"
              >
                Watch Video
              </Button>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={getStarted}
                maxW={"fit-content"}
              >
                Read Instructions.
              </Button>
            </Flex>
          </Flex>
          <Box flex="1 1 50%">{youtube}</Box>
        </Flex>
      </GlobalContainer>
    </Box>
  );
};

export default Hero;
