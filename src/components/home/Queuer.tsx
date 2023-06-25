/* eslint-disable react/no-unescaped-entities */
import QueueTable from "@/components/tables/QueueTable";
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import GlobalContainer from "../GlobalContainer";

export default function HomePage() {
  return (
    <GlobalContainer>
      <QueueTable />
    </GlobalContainer>
  );
}
