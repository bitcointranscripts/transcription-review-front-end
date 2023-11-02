import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "../navbar/Navbar";
import HeroSection from "./HeroSection";
import NeedSection from "./NeedSection";
import ReviewingProcess from "./ReviewingProcess";

const LandingPage = () => {
  return (
    <Box>
      <HeroSection />
      <NeedSection />
      {/*  */}
      <ReviewingProcess />
    </Box>
  );
};

export default LandingPage;
