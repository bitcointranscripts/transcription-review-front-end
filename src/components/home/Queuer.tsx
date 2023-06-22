/* eslint-disable react/no-unescaped-entities */
import QueueTable from "@/components/tables/QueueTable";
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import GlobalContainer from "../GlobalContainer";

export default function HomePage() {
  return (
    <GlobalContainer>
      <QueueTable />

      <Box mt={8}>
        <Heading size="md" mb={4}>
          How to Use This App
        </Heading>
        <Text mb={2}>
          Welcome! Here's a quick guide to help you navigate through the app.
        </Text>
        <Text mb={2}>
          - This platform hosts an array of Bitcoin recordings and videos to
          review and edit.
        </Text>
        <Text mb={2}>
          - Once you have claimed a transcript you will be able to modify the
          text in a markdown editor provided. This is not a magic editor. Feel
          free to copy the transcript to an editor of your choice to make the
          necessary modifications.
        </Text>
        <Text mb={2}>
          - A common setup for review might be with the video source in one
          browser window and the editor or a text editor of your choice in the
          other. We currently don't support mobile reviews.
        </Text>
        <Text mb={2}>
          - These transcripts are saved in{" "}
          <Link
            href="https://www.markdownguide.org/basic-syntax/"
            isExternal
            color="orange.500"
          >
            markdown
          </Link>
          . Please add headers and code highlights as appropriate. Headers are
          of particular importance as they indicate topics that readers can
          quickly scan as found on the right side of{" "}
          <Link
            href="https://btctranscripts.com/chaincode-labs/chaincode-podcast/2020-11-30-carl-dong-reproducible-builds/"
            isExternal
            color="orange.500"
          >
            this transcript
          </Link>{" "}
          (viewable on desktop only).
        </Text>
        <Text mb={2}>
          - All recordings have a title (some specified when generated and some
          pulled from youtube). Feel free to modify as needed.
        </Text>
        <Text mb={2}>
          - Your mission is to add as much missing metadata as you can. This
          might include dates of recording, speakers' names, etc. If you can't
          track that information down, it's OK. Just leave it blank.
        </Text>
        <Text mb={2}>
          - Want to listen to a podcast while browsing? Just click on the source
          button on the editor page.
        </Text>
        <Text mb={2}>
          - For transcripts with multiple speakers, there should be speaker
          labels (e.g. "speaker 0:" or "speaker 2:"). Use search-and-replace to
          label the speakers with the proper names.
        </Text>
        <Text mb={2}>
          - You have 24 hours to complete a review before it is returned to the
          queue for someone else to claim. If you need to step away, just hit
          the save button and you can return at a more convenient time.
        </Text>
        <Text mb={2}>
          - Once you submit your review, a PR will be opened on your behalf on
          the{" "}
          <Link
            href="https://github.com/bitcointranscripts/bitcointranscripts"
            isExternal
            color="orange.500"
          >
            bitcointranscripts GitHub repo
          </Link>{" "}
          and when merged, will be visible on{" "}
          <Link href="https://btctranscripts.com" isExternal color="orange.500">
            btctranscripts.com
          </Link>{" "}
          and soon after indexed on{" "}
          <Link href="https://bitcoinsearch.xyz" isExternal color="orange.500">
            bitcoinsearch.xyz
          </Link>
          .
        </Text>
      </Box>
    </GlobalContainer>
  );
}
