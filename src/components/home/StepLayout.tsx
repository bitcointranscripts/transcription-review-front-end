import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import PlayIcon from "../svgs/PlayIcon";
import YoutubePortal, { YoutubeModalInfo } from "./YoutubePortal";
import YoutubeComponent from "./YoutubeComponent";
import { YouTubePlayer } from "react-youtube";
import { UI_CONFIG } from "@/config/ui-config";

type PreverVideoProps = {
  handlePreferVideo: (
    // eslint-disable-next-line no-unused-vars
    e: React.MouseEvent<HTMLButtonElement>,
    // eslint-disable-next-line no-unused-vars
    step: 1 | 2 | 3
  ) => void;
  step: 1 | 2 | 3;
  width?: React.ComponentProps<typeof Box>["w"];
};

interface IStepLayout {
  children: React.ReactNode;
  heading: string;
  sub: string;
  stepNumber: 1 | 2 | 3;
  maxW?: string;
  src?: string;
  headingMaxW?: string;
  link: string;
}
const StepLayout: FC<IStepLayout> = ({
  children,
  heading,
  sub,
  stepNumber,
  maxW,
  src,
  headingMaxW,
  link,
}) => {
  const [modalPlayer, setModalPlayer] = useState<YouTubePlayer>(null);
  const [modalInfo, setModalInfo] = useState<YoutubeModalInfo>({
    visible: false,
    accordionStep: null,
  });
  const handlePreferVideo: PreverVideoProps["handlePreferVideo"] = (
    e,
    step
  ) => {
    // continue from last playback if played on same accordion step
    const playFromTimestamp = step !== modalInfo.accordionStep;
    setModalInfo({ visible: true, accordionStep: step });
    if (playFromTimestamp) {
      //@ts-ignore
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

  const handleClose = () => {
    modalPlayer.pauseVideo();
    setModalInfo((prev) => ({ ...prev, visible: false }));
  };

  const coloredText = heading.split(" ")[0];
  const othersText = heading.split(coloredText);
  return (
    <Flex flexDir={"column"}>
      <Flex gap={{ base: "18px", md: 4, "2xl": 10 }} alignItems={"start"}>
        <Image
          marginTop={"8px"}
          src={src ? src : "/home/cursor.png"}
          minW={{ base: "20px", lg: "40px", "2xl": "60px" }}
          minH={{ base: "20px", lg: "40px", "2xl": "60px" }}
          maxW={{ base: "20px", lg: "40px", "2xl": "60px" }}
          maxH={{ base: "20px", lg: "40px", "2xl": "60px" }}
          alt={"transcripts"}
        />
        <Flex
          flexDir={"column"}
          alignItems={"start"}
          justifyContent={"start"}
          gap={{ base: 7, lg: 4, xl: 8, "2xl": 10 }}
          maxW={{ base: maxW ? maxW : "660px", "2xl": "none" }}
        >
          <Text
            fontFamily={"Polysans"}
            fontSize={{
              base: "1.5rem",
              lg: "2.3rem",
              xl: "3.25rem",
              "2xl": "4.25rem",
            }}
            whiteSpace={{ base: "normal", md: "pre-line" }}
            maxW={{ base: headingMaxW ? headingMaxW : maxW, "2xl": "none" }}
            lineHeight={"105%"}
          >
            Step {stepNumber}:{" "}
            <Text fontWeight={600} as={"span"}>
              <Text as="span" color={"orange"}>
                {coloredText}
              </Text>
              {othersText}
            </Text>
          </Text>
          <Text
            fontFamily={"Aeonik Fono"}
            whiteSpace={{ base: "normal",  md: "pre-line" }}
            fontSize={{
              base: "1rem",
              lg: "1.18rem",
              xl: "1.625rem",
              "2xl": "2rem",
            }}
          >
            {sub}
          </Text>
        </Flex>
      </Flex>

      <Flex
        flexDir={"column"}
        mt={{ base: "28px", lg: "0px" }}
        gap={{ base: 10, lg: 0 }}
      >
        <Flex
          justifyContent={{ base: "start", lg: "end" }}
          pl={"40px"}
          fontFamily={"Aeonik Fono"}
        >
          <Button
            onClick={(e) => handlePreferVideo(e, stepNumber)}
            leftIcon={
              <Box className="dark-wrapper">
                <PlayIcon />
              </Box>
            }
            fontSize={{ base: "12px", lg: "18px", "2xl": "24px" }}
            colorScheme="dark"
            border={{ base: "1px solid #D9D9D9", "2xl": "3px solid #D9D9D9" }}
            fontWeight={500}
            py={{ base: "16px", lg: "28px", "2xl": "36px" }}
            px={{ base: "16px", lg: "28px" }}
            background={"#E6E6E6"}
            variant={"outline"}
            borderBottomRightRadius={{ base: "0.375rem", lg: "0px" }}
            borderBottom={{ "2xl": 0 }}
          >
            Watch tutorial
          </Button>
        </Flex>
        {children}
      </Flex>
      <YoutubePortal modalInfo={modalInfo} handleClose={handleClose}>
        <YoutubeComponent player={modalPlayer} setPlayer={setModalPlayer} />
      </YoutubePortal>
    </Flex>
  );
};

export default StepLayout;
