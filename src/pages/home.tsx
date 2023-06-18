import GlobalContainer from "@/components/GlobalContainer";
import Hero from "@/components/home/hero";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useRef } from "react";
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

  const accordionRef = useRef<HTMLDivElement>(null);

  const handleOnReady: YouTubeProps["onReady"] = (e) => {
    console.log(e.target);
  };

  const getStarted = () => {
    if (!accordionRef.current) return;
    // accordionRef.current.scrollIntoView({ behavior: "smooth" });
    const firstAccordionElement = accordionRef.current.childNodes[0] as HTMLDivElement;
    const firstAccordionButton = firstAccordionElement.querySelector("button");
    if (firstAccordionButton) {
      firstAccordionButton.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        firstAccordionButton.click();
      }, 500);
    }
  };

  return (
    <>
      <Hero getStarted={getStarted} />
      <Box>
        <GlobalContainer py={4}>
          <Heading size="lg">How it works!</Heading>
          <Box mt={5}>
            <Accordion ref={accordionRef}>
              <AccordionItem>
                <h2>
                  <AccordionButton >
                    <Box as="span" flex="1" textAlign="left" fontWeight={500}>
                      Why Edit Transcripts?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Box as="ul" fontSize={{base: "xs", md: "sm", lg: "md"}} fontWeight={400} style={{listStyle: "inside"}} color="gray.700" >
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
