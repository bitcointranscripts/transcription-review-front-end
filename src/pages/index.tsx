import QueueTable from "@/components/tables/QueueTable";
import { Box, Heading, Text, Link } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <QueueTable />

      <Box mt={8}>
        <Heading size="md" mb={4}>How to Use this App</Heading>
        <Text mb={2}>
          Welcome! Here's a quick guide to help you navigate through the app.
        </Text>
        <Text mb={2}>
          - This platform hosts an array of Bitcoin recordings and videos for you to review and edit.
        </Text>
        <Text mb={2}>
          - To claim a recording or video, you'll first need to sign in to your account.
        </Text>
        <Text mb={2}>
          - All recordings have a title (some specified when generated and some pulled from youtube). Feel free to modify as needed.
        </Text>
        <Text mb={2}>
          - Your mission to add as much missing metadata as you can. This might include dates of recording, speakers' names, etc. If you can't track that infomation down, it's OK. Just leave it blank.
        </Text>
        <Text mb={2}>
          - Want to listen to a podcast while browsing? Just click on the source button on the editor page.
        </Text>
        <Text mb={2}>
          - You have 24 hours to complete a review before it is returned to the queue for someone else to claim. If at any time you need to step away, just hit the save button and you can return at a more convenient time.
        </Text>
        <Text mb={2}>
          - Once you submit your review, a PR will be opened on your behalf on bitcointranscripts <Link href="https://github.com/bitcointranscripts/bitcointranscripts" isExternal color="orange.500">GitHub repo</Link> and when it is merged, will show up on <Link href="https://btctranscripts.com" isExternal color="orange.500">btctranscripts.com</Link>.
        </Text>
      </Box>
    </>
  );
}
