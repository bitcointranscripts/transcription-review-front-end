import GlobalContainer from "@/components/GlobalContainer";
import Hero from "@/components/home/Hero";
import MediaScreen from "@/components/home/MediaScreen";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Flex, Heading, Text, UnorderedList, ListItem, ListProps } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { AbstractedChakraComponentProps } from "../../types";

const StaticAccordionLists = [
  { 
    title: "Why Edit Transcripts?",
    list: [
      "Build proof of work by contributing to bitcoin (we’ll write your GitHub name as a contributor)",
      "Improve your comprehension of bitcoin and lightning",
      "Make it easier to discover, search for, and use information about technical bitcoin concepts"
    ]
  },
  { 
    title: "Step 0: What you’ll need",
    list: [
      "A computer (mobile not supported)",
      "A GitHub account",
      "A few hours in a 24 hour span to work on the transcript. You’ll need to submit the transcript within 24 hours of claiming it."
    ]
  },
]

const HomePage = () => {
  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      start: 40,
      controls: 0,
    },
  };

  const accordionRef = useRef<HTMLDivElement>(null);

  const handleOnReady: YouTubeProps["onReady"] = (e) => {
    console.log(e.target);
  };

  const getStarted = () => {
    // console.log(e)
    if (!accordionRef.current) return;
    // accordionRef.current.scrollIntoView({ behavior: "smooth" });
    const firstAccordionElement = accordionRef.current.childNodes[0] as HTMLDivElement;
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
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left" fontWeight={500}>
                      Why Edit Transcripts?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Spacedlist>
                    <ListItem>Build proof of work by contributing to bitcoin (we’ll write your GitHub name as a contributor)</ListItem>
                    <ListItem>Improve your comprehension of bitcoin and lightning</ListItem>
                    <ListItem>Make it easier to discover, search for, and use information about technical bitcoin concepts</ListItem>
                  </Spacedlist>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left' fontWeight={500}>
                      Step 0: What you’ll need
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Spacedlist>
                    <ListItem>A computer (mobile not supported)</ListItem>
                    <ListItem>A GitHub account</ListItem>
                    <ListItem>A few hours in a 24 hour span to work on the transcript. You’ll need to submit the transcript within 24 hours of claiming it.</ListItem>
                  </Spacedlist>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex='1' textAlign='left' fontWeight={500}>
                      Step 1: Create an account & claim recording (1 min to read)
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <TLDRText text="Connect your GitHub to BTCTranscripts" />
                  <Spacedlist>
                    <ListItem>Make sure you have a GitHub account (instructions 
                      <LinkText text="here" href="https://docs.github.com/en/get-started/signing-up-for-github/signing-up-for-a-new-github-account" /> )
                    </ListItem>
                    <ListItem>Connect your GitHub account to BTCTranscripts by clicking “Sign In”</ListItem>
                    <ListItem>
                      <Flex>
                        <Spacedlist flex="0 1 60%" listStyleType="none" >
                          <ListItem>
                            The following screen will pop up
                          </ListItem>
                          <ListItem>In English, the screen says that BTCTranscripts will write your transcript onto GitHub so that it can be reviewed. (Nerd stuff: in addition to the live website, final transcripts will actually live in the BTCTranscripts GitHub repository, check them out
                            <LinkText text="here" href="https://github.com/bitcointranscripts/bitcointranscripts" />
                            )
                          </ListItem>
                        </Spacedlist>
                        <Box w="full" h="full" maxW="160px" mx="auto">
                          <MediaScreen mediaElement={<img src="/home/authorize.png" alt="annotation_github_authorize" className="responsive-image" />} />
                        </Box>
                      </Flex>
                    </ListItem>
                    <ListItem>
                      <Flex>
                        <Spacedlist flex="0 1 60%" listStyleType="none" >
                          <ListItem>
                            Once signed in, find a transcript that catches your fancy, and click “Claim.”
                          </ListItem>
                          <ListItem>
                            Time to edit!
                          </ListItem>
                        </Spacedlist>
                        <Box w="full">
                          <MediaScreen mediaElement={<img src="/home/queuer_table.png" alt="annotation_queuer_table" className="responsive-image" />} />
                        </Box>
                      </Flex>
                    </ListItem>
                  </Spacedlist>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left" fontWeight={500}>
                      Step 2: Review & edit transcript (2 mins to read)
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <TLDRText text="Use markdown. Make sure stuff is accurate. Use “replace” in case of multispeaker transcripts. Use split screen to listen and edit transcript at the same time." />
                  <Heading size="sm" my={4}>Using Markdown</Heading>
                  <Spacedlist>
                    <ListItem>{`We use markdown. This is a way of writing text that tells computers how to display information - like what's a title, header, what’s bolded, and the like.`}
                    </ListItem>
                    <ListItem>
                      {`You probably won’t need to use anything apart from Header 1, Header 2, bolding, italics, and hyperlinks. Here's a super `}
                      <LinkText text="quick primer" href="https://www.markdownguide.org/basic-syntax/" />
                    </ListItem>
                    <ListItem>
                      <Flex>
                        <Spacedlist flex="0 1 60%" listStyleType="none">
                          <ListItem>To the right you’ll see how this all comes together.</ListItem>
                          <ListItem>The leftmost image is what you’ll see as you edit the transcript. Notice the use of Header 1, Header 2, and hyperlinks with markdown
                          </ListItem>
                        </Spacedlist>
                        <Box w="full" h="full" maxW="160px" mx="auto">
                          <MediaScreen mediaElement={<img src="/home/authorize.png" alt="annotation_github_authorize" className="responsive-image" />} />
                        </Box>
                      </Flex>
                    </ListItem>
                    <ListItem>
                      <Flex>
                        <Spacedlist flex="0 1 60%" listStyleType="none" >
                          <ListItem>
                            Once signed in, find a transcript that catches your fancy, and click “Claim.”
                          </ListItem>
                          <ListItem>
                            Time to edit!
                          </ListItem>
                        </Spacedlist>
                        <Box w="full">
                          <MediaScreen mediaElement={<img src="/home/queuer_table.png" alt="annotation_queuer_table" className="responsive-image" />} />
                        </Box>
                      </Flex>
                    </ListItem>
                  </Spacedlist>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </GlobalContainer>
      </Box>
    </>
  );
};

export default HomePage;

export const Spacedlist: React.FC<AbstractedChakraComponentProps<ListProps>> = ({ children, ...chakraProps }) => {
  return (
    <UnorderedList spacing="2" fontSize={{base: "xs", md: "sm", lg: "md"}} fontWeight={400} color="gray.700" {...chakraProps} >
      {children}
    </UnorderedList>
  );
};

export const TLDRText = ({ text }: { text: string }) => {
  return (
    <Text mb={2} color="purple.400" fontWeight={500} fontSize="16px">
      <span style={{ fontWeight: 600 }}>TLDR;</span>
      {text}
    </Text>
  );
};

export const LinkText = ({ text, href }: { text: string; href: string }) => {
  return (
    <span>
      <Link style={{ color: "var(--chakra-colors-blue-600)" }} href={href}>
        {text}
      </Link>
    </span>
  );
};
