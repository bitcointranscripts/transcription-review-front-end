import GlobalContainer from "@/components/GlobalContainer";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";

const HomePage = () => {
  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      start: 40,
      controls: 0,
    },
  };

  const handleOnReady: YouTubeProps["onReady"] = (e) => {
    console.log(e.target);
  };
  return (
    <>
      <Box backgroundImage="url('/bg_gray.jpg')" bgSize="cover" bgColor="whiteAlpha.700" bgBlendMode="lighten" >
        {/* <Box pos="fixed" isolation="isolate" top="0" left="0" zIndex={0} w="100%" h="100%" bgColor="blackAlpha.800"></Box> */}
        <GlobalContainer py={4} >
          <Flex direction={{base: "column", sm: "row"}} gap={4}>
            <Flex flex="1 1 50%" gap={4} direction="column" justifyContent="left" >
              <Heading size={{base: "xl", md: "2xl", lg: "3xl"}} letterSpacing="0.08ch" color="gray.800" textShadow="dark-lg" >
                Create accurate transcriptions of technical Bitcoin talks
              </Heading>
              <Box as="ul" mt={4} fontSize={{base: "sm", md: "md", lg: "lg"}} fontWeight={500} style={{listStyle: "none"}} color="gray.500" >
                <li><Text>Step 1: Create account + claim recording</Text></li>
                <li><Text>Step 2: Review & edit transcript</Text></li>
                <li><Text>Step 3: Submit (and change the world)</Text></li>
              </Box>
              <Button mt={4} alignSelf="center" variant="outline" colorScheme="blue">
                Get Started
              </Button>
            </Flex>
            <Box flex="1 1 50%">
              <div className="iframe-wrapper">
                {/* <YouTube videoId='YNIFm0QFAuA' onReady={handleOnReady} {...opts} /> */}
                <iframe
                  className="embedded-video protrude"
                  id="ytplayer"
                  type="text/html"
                  width="500"
                  height="200"
                  src="https://www.youtube.com/embed/YNIFm0QFAuA?start=40"
                ></iframe>
              </div>
            </Box>
          </Flex>
        </GlobalContainer>
      </Box>
      <Box>
        <GlobalContainer py={4} >
          <Heading size="lg">How it works!</Heading>
          <Box mt={5}>
            <Accordion allowToggle={true} >
              <AccordionItem>
                <h2>
                  <AccordionButton >
                    <Box as="span" flex='1' textAlign='left' fontWeight={500}>
                      Why Edit Transcripts?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Box as="ul" fontSize={{base: "xs", md: "sm", lg: "md"}} fontWeight={400} style={{listStyle: "inside"}} color="gray.600" >
                    <li>Build proof of work by contributing to bitcoin (we’ll write your GitHub name as a contributor)</li>
                    <li>Improve your comprehension of bitcoin and lightning</li>
                    <li>Make it easier to discover, search for, and use information about technical bitcoin concepts</li>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton >
                    <Box as="span" flex='1' textAlign='left' fontWeight={500}>
                      Step 0: What you’ll need
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Box as="ul" fontSize={{base: "xs", md: "sm", lg: "md"}} fontWeight={400} style={{listStyle: "inside"}} color="gray.600" >
                    <li>A computer (mobile not supported)</li>
                    <li>A GitHub account</li>
                    <li>A few hours in a 24 hour span to work on the transcript. You’ll need to submit the transcript within 24 hours of claiming it.</li>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </GlobalContainer>
      </Box>
    </>
  );
};

export default HomePage;
