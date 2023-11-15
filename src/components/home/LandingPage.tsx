import { Box } from "@chakra-ui/react";
import React from "react";
import HeroSection from "./HeroSection";
import NeedSection from "./NeedSection";
import ReviewingProcess from "./ReviewingProcess";
import EverythingYouNeed from "./EverythingYouNeed";
import ReadyToReview from "./ReadyToReview";
import LandingFooter from "./LandingFooter";
import useMobileWarning from "@/hooks/useMobileWarning";
import MobileWarningModal from "../mobileUnsupported/MobileWarningModal";
import { signIn } from "next-auth/react";

const LandingPage = () => {
  const { isMobileAction, showWarning, closeWarning } = useMobileWarning();

  const getStarted = async () => {
    const mobileAction = isMobileAction();
    if (!mobileAction) {
      signIn("github", { callbackUrl: "/signin", redirect: true });
    }
  };
  return (
    <Box>
      <HeroSection getStarted={getStarted} />
      <NeedSection />
      <EverythingYouNeed />
      <ReviewingProcess />
      <ReadyToReview getStarted={getStarted} />
      <LandingFooter />
      <MobileWarningModal isOpen={showWarning} onClose={closeWarning} />
    </Box>
  );
};

export default LandingPage;
