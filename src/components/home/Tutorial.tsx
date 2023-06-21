import GlobalContainer from "@/components/GlobalContainer";
import Hero from "@/components/home/Hero";
import {
  FirstAccordion,
  StepOne,
  StepThree,
  StepTwo,
  StepZero,
} from "@/components/home/Steps";
import YoutubeComponent from "@/components/home/YoutubeComponent";
import YoutubePortal from "@/components/home/YoutubePortal";
import { Accordion, Box, Button, Heading, Icon } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import { YouTubePlayer } from "react-youtube";

const HomePageTutorial = () => {
  const accordionRef = useRef<HTMLDivElement>(null);
  const { status: sessionStatus } = useSession();

  const [player, setPlayer] = useState<YouTubePlayer>(null);

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
            <Accordion ref={accordionRef} allowToggle>
              <FirstAccordion />
              <StepZero />
              <StepOne />
              <StepTwo />
              <StepThree />
            </Accordion>
          </Box>
          <Box display="grid" placeItems="center" width="full" pt={8}>
            {sessionStatus !== "authenticated" ? (
              <Button
                variant="outline"
                mx="auto"
                isLoading={sessionStatus === "loading"}
                onClick={() => signIn("github", { callbackUrl: "/" })}
              >
                Sign In
                <Icon
                  ml={2}
                  w="20px"
                  h="20px"
                  color="gray.500"
                  as={FaGithub}
                  display="block"
                />
              </Button>
            ) : (
              <Link href="/">
                <Button variant="outline" role="group">
                  <Icon
                    mr={3}
                    w="16px"
                    h="16px"
                    color="gray.500"
                    as={FaArrowRight}
                    display="block"
                    _groupHover={{
                      transform: "translateX(3px)",
                      color: "orange.400",
                      transitionProperty: "all",
                      transitionDuration: "0.5s",
                    }}
                  />
                  Go To Transcripts
                </Button>
              </Link>
            )}
          </Box>
        </GlobalContainer>
      </Box>
      <YoutubePortal>
        <YoutubeComponent player={player} setPlayer={setPlayer} />
      </YoutubePortal>
    </>
  );
};

export default HomePageTutorial;
