import GlobalContainer from "@/components/GlobalContainer";
import Hero from "@/components/home/Hero";
import MediaScreen from "@/components/home/MediaScreen";
import { FirstAccordion, StepOne, StepThree, StepTwo, StepZero } from "@/components/home/Steps";
import YoutubePortal from "@/components/home/YoutubePortal";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  ListItem,
} from "@chakra-ui/react";
import React, { useRef } from "react";

const StaticAccordionLists = [
  {
    title: "Why Edit Transcripts?",
    list: [
      "Build proof of work by contributing to bitcoin (we’ll write your GitHub name as a contributor)",
      "Improve your comprehension of bitcoin and lightning",
      "Make it easier to discover, search for, and use information about technical bitcoin concepts",
    ],
  },
  {
    title: "Step 0: What you’ll need",
    list: [
      "A computer (mobile not supported)",
      "A GitHub account",
      "A few hours in a 24 hour span to work on the transcript. You’ll need to submit the transcript within 24 hours of claiming it.",
    ],
  },
];

const HomePage = () => {
  const accordionRef = useRef<HTMLDivElement>(null);

  const getStarted = () => {
    // console.log(e)
    if (!accordionRef.current) return;
    // accordionRef.current.scrollIntoView({ behavior: "smooth" });
    const firstAccordionElement = accordionRef.current
      .childNodes[0] as HTMLDivElement;
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
        <GlobalContainer py={16}>
          <Heading size="lg">How it works!</Heading>
          <Box mt={5}>
            <Accordion ref={accordionRef}>
              <FirstAccordion />
              <StepZero />
              <StepOne />
              <StepTwo />
              <StepThree />
            </Accordion>
          </Box>
        </GlobalContainer>
      </Box>
    </>
  );
};

export default HomePage;
