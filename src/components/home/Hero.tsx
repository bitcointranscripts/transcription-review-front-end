import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import GlobalContainer from "../GlobalContainer";

const Hero = ({ getStarted }: { getStarted: () => void }) => {
  const [playerReady, setPlayerReady] = useState({
    player: null,
  });
  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
    },
  };
  const handleOnReady: YouTubeProps["onReady"] = (e) => {
    // prevent flickering
    setTimeout(() => {
      setPlayerReady({
        player: e.target,
      });
    }, 500);
  };
  return (
    <Box
      backgroundImage="url('/home/bg_gray.jpg')"
      bgSize="cover"
      bgColor="whiteAlpha.700"
      bgBlendMode="lighten"
    >
      {/* <Box pos="fixed" isolation="isolate" top="0" left="0" zIndex={0} w="100%" h="100%" bgColor="blackAlpha.800"></Box> */}
      <GlobalContainer py={4}>
        <Flex direction={{ base: "column", sm: "row" }} gap={4}>
          <Flex flex="1 1 50%" gap={4} direction="column" justifyContent="left">
            <Heading
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              letterSpacing="0.08ch"
              color="gray.800"
              textShadow="dark-lg"
            >
              Create accurate transcriptions of technical Bitcoin talks
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
                <Text>Step 3: Submit (and change the world)</Text>
              </li>
            </Box>
            <Button
              mt={4}
              alignSelf="center"
              variant="outline"
              colorScheme="blue"
              onClick={getStarted}
            >
              Get Started
            </Button>
          </Flex>
          <Box flex="1 1 50%">
            <div
              style={
                Boolean(playerReady.player) ? { opacity: 1 } : { opacity: 0 }
              }
            >
              <YouTube
                videoId="YNIFm0QFAuA"
                onReady={handleOnReady}
                {...opts}
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "10px 10px 40px 5px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>
            {/* <div className="iframe-wrapper">
              <iframe
                className="embedded-video protrude"
                id="ytplayer"
                // type="text/html"
                width="500"
                height="200"
                src="https://www.youtube.com/embed/YNIFm0QFAuA?start=40&rel=0&fs=1"
              ></iframe>
            </div> */}
          </Box>
        </Flex>
      </GlobalContainer>
    </Box>
  );
};

export default Hero;
