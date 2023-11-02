import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "../navbar/Navbar";
import HeroSection from "./HeroSection";
import NeedSection from "./NeedSection";

const LandingPage = () => {
  return (
    <Box>
      <HeroSection />
      <NeedSection />
    </Box>
  );
};

export default LandingPage;
