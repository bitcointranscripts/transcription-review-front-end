import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import GlobalContainer from "../GlobalContainer";

const Hero = ({ getStarted }: { getStarted: () => void }) => {
  return (
    <Box bgColor="gray.100">
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
          <Box flex="1 1 50%" id="hero-youtube-player"></Box>
        </Flex>
      </GlobalContainer>
    </Box>
  );
};

export default Hero;
