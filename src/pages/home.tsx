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
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { FaGithub } from "react-icons/fa";

const HomePage = () => {
  const accordionRef = useRef<HTMLDivElement>(null);
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  // const handleHomeProgress = () => {
  //   const isUnAuthenticated = sessionStatus === "unauthenticated";
  //   if (isUnAuthenticated) {
  //     signIn("github", { callbackUrl: "/" });
  //   } else {
  //     router.push("/");
  //   }
  // };

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
                <Button variant="outline">Transcripts Queue</Button>
              </Link>
            )}
          </Box>
        </GlobalContainer>
      </Box>
    </>
  );
};

export default HomePage;
