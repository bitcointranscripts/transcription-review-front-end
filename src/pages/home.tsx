import GlobalContainer from "@/components/GlobalContainer";
import Hero from "@/components/home/Hero";
import {
  FirstAccordion,
  StepOne,
  StepThree,
  StepTwo,
  StepZero,
} from "@/components/home/Steps";
import { Accordion, Box, Button, Heading, Icon } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import React, { useRef } from "react";
import { FaGithub } from "react-icons/fa";

const HomePage = () => {
  const accordionRef = useRef<HTMLDivElement>(null);

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
            <Accordion ref={accordionRef}>
              <FirstAccordion />
              <StepZero />
              <StepOne />
              <StepTwo />
              <StepThree />
            </Accordion>
          </Box>
          <Box
            display="grid"
            placeItems="center"
            width="full"
            pt={8}
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <Button variant="outline" mx="auto">
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
          </Box>
        </GlobalContainer>
      </Box>
    </>
  );
};

export default HomePage;
