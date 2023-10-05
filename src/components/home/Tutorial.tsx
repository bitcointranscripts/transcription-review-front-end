import GlobalContainer from "@/components/GlobalContainer";
import Hero from "@/components/home/Hero";
import {
  FirstAccordion,
  PreverVideoProps,
  PreferVideoButton,
  StepOne,
  StepThree,
  StepTwo,
  StepZero,
} from "@/components/home/Steps";
import YoutubeComponent from "@/components/home/YoutubeComponent";
import YoutubePortal from "@/components/home/YoutubePortal";
import { UI_CONFIG } from "@/config/ui-config";
import { Accordion, Box, Button, Heading, Icon } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import { YouTubePlayer } from "react-youtube";

export type YoutubeModalInfo = {
  visible: boolean;
  accordionStep: null | number;
};

const HomePageTutorial = () => {
  const accordionRef = useRef<HTMLDivElement>(null);
  const { status: sessionStatus } = useSession();

  const [player, setPlayer] = useState<YouTubePlayer>(null);
  const [modalPlayer, setModalPlayer] = useState<YouTubePlayer>(null);
  const [modalInfo, setModalInfo] = useState<YoutubeModalInfo>({
    visible: false,
    accordionStep: null,
  });

  const handleClose = () => {
    modalPlayer.pauseVideo();
    setModalInfo((prev) => ({ ...prev, visible: false }));
  };

  const getStarted = () => {
    if (!accordionRef.current) return;
    const firstAccordionElement = accordionRef.current
      .childNodes[0] as HTMLDivElement;
    const firstAccordionButton = firstAccordionElement.querySelector("button");
    if (
      firstAccordionButton &&
      firstAccordionButton?.ariaExpanded === "false"
    ) {
      firstAccordionButton.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        firstAccordionButton.click();
      }, 500);
    }
  };

  const handlePreferVideo: PreverVideoProps["handlePreferVideo"] = (
    e,
    step
  ) => {
    // continue from last playback if played on same accordion step
    const playFromTimestamp = step !== modalInfo.accordionStep;
    setModalInfo({ visible: true, accordionStep: step });
    if (playFromTimestamp) {
      const timeStamp = UI_CONFIG.YOUTUBE_TIMESTAMP_IN_SECONDS[step];
      modalPlayer.mute();
      modalPlayer.seekTo(timeStamp);
      // some delay to load thumbnail before pause, prevents infinite ui loading
      setTimeout(() => {
        modalPlayer.pauseVideo();
        modalPlayer.unMute();
      }, 1000);
    }
  };

  return (
    <>
      <Hero
        getStarted={getStarted}
        youtube={<YoutubeComponent player={player} setPlayer={setPlayer} />}
      />
      <Box>
        <GlobalContainer py={16}>
          <Heading size="lg">How it works!</Heading>
          <Box mt={5}>
            <Accordion ref={accordionRef} allowToggle>
              <FirstAccordion />
              <StepZero />
              <StepOne
                preferVideoComponent={
                  <Box mb="3">
                    <PreferVideoButton
                      handlePreferVideo={handlePreferVideo}
                      step={1}
                      width="initial"
                    />
                  </Box>
                }
              />
              <StepTwo
                preferVideoComponent={
                  <PreferVideoButton
                    handlePreferVideo={handlePreferVideo}
                    step={2}
                  />
                }
              />
              <StepThree
                preferVideoComponent={
                  <PreferVideoButton
                    handlePreferVideo={handlePreferVideo}
                    step={3}
                  />
                }
              />
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
      <YoutubePortal modalInfo={modalInfo} handleClose={handleClose}>
        <YoutubeComponent player={modalPlayer} setPlayer={setModalPlayer} />
      </YoutubePortal>
    </>
  );
};

export default HomePageTutorial;
