import { Box } from "@chakra-ui/react";
import React from "react";
import HeroSection from "./HeroSection";
import NeedSection from "./NeedSection";
import ReviewingProcess from "./ReviewingProcess";
import EverythingYouNeed from "./EverythingYouNeed";

const LandingPage = () => {
  return (
    <Box>
      <HeroSection />
      <NeedSection />
      <EverythingYouNeed />
      <ReviewingProcess />
    </Box>
  );
};

export default LandingPage;
