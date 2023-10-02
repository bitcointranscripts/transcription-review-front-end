import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  ListItem,
  ListProps,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { AbstractedChakraComponentProps } from "../../../types";
import MediaScreen from "./MediaScreen";
import Image from "next/image";

// eslint-disable-next-line no-unused-vars
const StaticAccordionLists = [
  {
    title: "Why Edit Transcripts?",
    list: [
      "Build proof of work by contributing to bitcoin (we'll write your GitHub name as a contributor)",
      "Improve your comprehension of bitcoin and lightning",
      "Make it easier to discover, search for, and use information about technical bitcoin concepts",
    ],
  },
  {
    title: "Step 0: What you'll need",
    list: [
      "A computer (mobile not supported)",
      "A GitHub account",
      "A few hours in a 24 hour span to work on the transcript. You'll need to submit the transcript within 24 hours of claiming it.",
    ],
  },
];

export type PreverVideoProps = {
  handlePreferVideo: (
    // eslint-disable-next-line no-unused-vars
    e: React.MouseEvent<HTMLButtonElement>,
    // eslint-disable-next-line no-unused-vars
    step: 1 | 2 | 3
  ) => void;
  step: 1 | 2 | 3;
  width?: React.ComponentProps<typeof Box>["w"];
};

type PreferVideoCompponent = {
  preferVideoComponent: React.ReactNode;
};

export const FirstAccordion = () => {
  return (
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
          <ListItem>
            Build proof of work by contributing to bitcoin (we’ll write your
            GitHub name as a contributor)
          </ListItem>
          <ListItem>
            Improve your comprehension of bitcoin and lightning
          </ListItem>
          <ListItem>
            Make it easier to discover, search for, and use information about
            technical bitcoin concepts
          </ListItem>
        </Spacedlist>
      </AccordionPanel>
    </AccordionItem>
  );
};

export const StepThree = ({ preferVideoComponent }: PreferVideoCompponent) => {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left" fontWeight={500}>
            Step 3: Submit transcript (1 min to read)
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        <TLDRText text="Once you submit, you’re done! Submitted transcripts are reviewed by a human and then published through GitHub." />
        {preferVideoComponent}
        <Spacedlist>
          <ListItem>
            Once you submit your transcript, it will create a PR (pull request)
            of your edited transcript from the original transcript
          </ListItem>
          <ListItem>
            (Nerd stuff: Pull Requests (also called PRs or merge requests)
            inform others that you’re making a change from an original piece of
            code. The transcript text is technically code because it’s what the{" "}
            <LinkText text="live site" href="https://btctranscripts.com/" />{" "}
            uses. The original code was the transcript before you made the
            edits. So, you “pulled” that code and are requesting your new,
            edited code to be used instead.)
          </ListItem>
          <ListItem>
            <Flex gap={4}>
              <Spacedlist flex="0 1 40%" listStyleType="none">
                <ListItem>
                  If you want to see your transcript, visit your profile and
                  click the link.
                </ListItem>
                <ListItem>
                  On the transcript’s GitHub PR, you can click the “Files
                  changed” nav button to view.
                </ListItem>
              </Spacedlist>
              <Box w="full" maxW="300px" h="full" mx="auto">
                <MediaScreen
                  mediaElement={
                    <Image
                      src="/home/github_pr_screen.png"
                      width={200}
                      alt="annotation_github_pr_screen"
                      className="responsive-image"
                      height={200}
                    />
                  }
                />
              </Box>
            </Flex>
          </ListItem>
          <ListItem>
            A human will review your newly edited code/ transcript. It will then
            be published once accepted.
          </ListItem>
          <ListItem>
            {`If it’s not accepted, you’ll be able to continue making changes through conversations on GitHub`}
          </ListItem>
          <ListItem>
            {`Once your transcript is accepted and published, you'll receive sats as thanks in your account wallet. You'll be able to withdraw them to your wallet of choice over lightning.`}
          </ListItem>
        </Spacedlist>
      </AccordionPanel>
    </AccordionItem>
  );
};

export const StepTwo = ({ preferVideoComponent }: PreferVideoCompponent) => {
  return (
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
        {preferVideoComponent}
        <Heading size="sm" my={4}>
          Using Markdown
        </Heading>
        <Spacedlist>
          <ListItem>
            {`We use markdown. This is a way of writing text that tells computers how to display information - like what's a title, header, what’s bolded, and the like.`}
          </ListItem>
          <ListItem>
            {`You probably won’t need to use anything apart from Header 1, Header 2, bolding, italics, and hyperlinks. Here's a super `}
            <LinkText
              text="quick primer"
              href="https://www.markdownguide.org/basic-syntax/"
            />
          </ListItem>
          <ListItem>
            <Flex gap={4} direction={{ base: "column", md: "row" }}>
              <Spacedlist flex="0 1 30%" listStyleType="none">
                <ListItem>
                  To the right you’ll see how this all comes together.
                </ListItem>
                <ListItem>
                  The leftmost image is what you’ll see as you edit the
                  transcript. Notice the use of Header 1, Header 2, and
                  hyperlinks with markdown
                </ListItem>
                <ListItem>
                  The middle image is what will live in the{" "}
                  <LinkText
                    text="GitHub repository"
                    href="https://raw.githubusercontent.com/bitcointranscripts/bitcointranscripts/master/bitcoinology/2022-01-26-igor-korsakov-cool-ln-developments.md"
                  />
                  . This is automatically created when you submit your
                  transcript.
                </ListItem>
                <ListItem>
                  The right image is what will live on the
                  <LinkText
                    text=" live site"
                    href="https://btctranscripts.com/bitcoinology/2022-01-26-igor-korsakov-cool-ln-developments/"
                  />
                  . This is also automatically created once the review is
                  finalized.
                </ListItem>
              </Spacedlist>
              <Box w="full" h="full" mx="auto">
                <MediaScreen
                  mediaElement={
                    <Image
                      src="/home/transcript_all_screen.png"
                      alt="annotation_transcript_all_screen"
                      className="responsive-image"
                      height={200}
                      width={200}
                    />
                  }
                />
              </Box>
            </Flex>
          </ListItem>
        </Spacedlist>
        <Heading size="sm" my={4}>
          What makes a great transcript?
        </Heading>
        <Text my={4}>
          A great transcript has the following accurately written:
        </Text>
        <Spacedlist spacing={1} ml={8}>
          <ListItem>Title</ListItem>
          <ListItem>Author(s)</ListItem>
          <ListItem>Date of original presentation</ListItem>
          <ListItem>
            Categories (for example, conference, meetup, and the like)
          </ListItem>
          <ListItem>Tags (that is, main topics)</ListItem>
          <ListItem>
            Sections (blocks of conversation that are grouped by a theme)
          </ListItem>
          <ListItem>
            Grammar and spelling (especially technical concepts)
          </ListItem>
        </Spacedlist>
        <Text my={4}>And the use of markdown!</Text>
        <Text my={4}>Check out the following transcripts for inspiration:</Text>
        <Spacedlist spacing={1} ml={8}>
          <ListItem>
            <LinkText
              text="Silent Payments and Alternatives"
              href="https://btctranscripts.com/tabconf/2022/2022-10-15-silent-payments/"
            />
          </ListItem>
          <ListItem>
            <LinkText
              text="Bitcoin Sidechains - Unchained Epicenter"
              href="https://btctranscripts.com/misc/bitcoin-sidechains-unchained-epicenter-adam3us-gmaxwell/"
            />
          </ListItem>
          <ListItem>
            <LinkText
              text="Deep Dive Bitcoin Core V0.15"
              href="https://btctranscripts.com/greg-maxwell/2017-08-28-gmaxwell-deep-dive-bitcoin-core-v0.15/"
            />
          </ListItem>
        </Spacedlist>
        <Heading size="sm" my={4}>
          Optimal setup and lifehacks
        </Heading>
        <Spacedlist>
          <ListItem>
            <Flex gap={4} direction={{ base: "column", md: "row" }}>
              <Spacedlist listStyleType="none">
                <ListItem>
                  An ideal setup is using split screen to make edits while
                  listening live to the original recording
                </ListItem>
                <ListItem>
                  You can find the original recording by clicking the “Source”
                  button
                </ListItem>
              </Spacedlist>
              <Box w="full" h="full" mx="auto">
                <MediaScreen
                  mediaElement={
                    <Image
                      src="/home/split_screen.png"
                      alt="annotation_split_screen"
                      className="responsive-image"
                      height={200}
                      width={200}
                    />
                  }
                />
              </Box>
            </Flex>
          </ListItem>
          <ListItem>
            {`For transcripts with multiple speakers, there should be speaker labels (e.g. "speaker 0:" or "speaker 2:"). Use search-and-replace to label the speakers with the proper names.`}
          </ListItem>
        </Spacedlist>
      </AccordionPanel>
    </AccordionItem>
  );
};
export const StepOne = ({ preferVideoComponent }: PreferVideoCompponent) => {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left" fontWeight={500}>
            Step 1: Create an account & claim recording (1 min to read)
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        {preferVideoComponent}
        <TLDRText text="Connect your GitHub to BTCTranscripts" />
        <Spacedlist>
          <ListItem>
            Make sure you have a GitHub account (instructions{" "}
            <LinkText
              text="here"
              href="https://docs.github.com/en/get-started/signing-up-for-github/signing-up-for-a-new-github-account"
            />{" "}
            )
          </ListItem>
          <ListItem>
            Connect your GitHub account to BTCTranscripts by clicking “Sign In”
          </ListItem>
          <ListItem>
            <Flex gap={4}>
              <Spacedlist margin={0} flex="0 1 60%" listStyleType="none">
                <ListItem>The following screen will pop up</ListItem>
                <ListItem>
                  In English, the screen says that BTCTranscripts will write
                  your transcript onto GitHub so that it can be reviewed. (Nerd
                  stuff: in addition to the live website, final transcripts will
                  actually live in the BTCTranscripts GitHub repository, check
                  them out
                  <LinkText
                    text=" here"
                    href="https://github.com/bitcointranscripts/bitcointranscripts"
                  />
                  )
                </ListItem>
              </Spacedlist>
              <Box w="full" h="full" maxW="160px" mx="auto">
                <MediaScreen
                  mediaElement={
                    <Image
                      src="/home/authorize.png"
                      alt="annotation_github_authorize"
                      className="responsive-image"
                      height={200}
                      width={200}
                    />
                  }
                />
              </Box>
            </Flex>
          </ListItem>
          <ListItem listStyleType="none">
            <Flex gap={4}>
              <Box w="full">
                <MediaScreen
                  mediaElement={
                    <Image
                      src="/home/queuer_table.png"
                      alt="annotation_queuer_table"
                      className="responsive-image"
                      height={200}
                      width={200}
                    />
                  }
                />
              </Box>
              <Spacedlist
                flex="0 1 60%"
                alignSelf="center"
                listStyleType="none"
              >
                <ListItem>
                  Once signed in, find a transcript that catches your fancy, and
                  click “Claim.”
                </ListItem>
                <ListItem>Time to edit!</ListItem>
              </Spacedlist>
            </Flex>
          </ListItem>
        </Spacedlist>
      </AccordionPanel>
    </AccordionItem>
  );
};
export const StepZero = () => {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left" fontWeight={500}>
            Step 0: What you’ll need
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        <Spacedlist>
          <ListItem>A computer (mobile not supported)</ListItem>
          <ListItem>A GitHub account</ListItem>
          <ListItem>
            A few hours in a 24 hour span to work on the transcript. You’ll need
            to submit the transcript within 24 hours of claiming it.
          </ListItem>
        </Spacedlist>
      </AccordionPanel>
    </AccordionItem>
  );
};

export const Spacedlist: React.FC<
  AbstractedChakraComponentProps<ListProps>
> = ({ children, ...chakraProps }) => {
  return (
    <UnorderedList
      spacing="4"
      fontSize={{ base: "xs", md: "sm", lg: "md" }}
      fontWeight={400}
      color="gray.700"
      {...chakraProps}
    >
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
      <Link
        style={{ color: "var(--chakra-colors-blue-600)" }}
        href={href}
        target="_blank"
      >
        {text}
      </Link>
    </span>
  );
};

export const PreferVideoButton = ({
  handlePreferVideo,
  step,
  width = "fit-content",
}: PreverVideoProps) => {
  return (
    <Box ml="auto" w={width}>
      <Button
        variant="link"
        colorScheme="blue"
        onClick={(e) => handlePreferVideo(e, step)}
        size="lg"
        fontWeight={900}
      >
        prefer video?
      </Button>
    </Box>
  );
};
