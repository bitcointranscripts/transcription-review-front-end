import { Box } from "@chakra-ui/react";
import React from "react";
import HeroSection from "./HeroSection";
import NeedSection from "./NeedSection";
import ReviewingProcess from "./ReviewingProcess";
import EverythingYouNeed from "./EverythingYouNeed";
import ReadyToReview from "./ReadyToReview";
import LandingFooter from "./LandingFooter";

const LandingPage = () => {
  return (
    <Box>
      <HeroSection />
      <NeedSection />
      <EverythingYouNeed />
      <ReviewingProcess />
      <ReadyToReview />
      <LandingFooter />
    </Box>
  );
};

export default LandingPage;
