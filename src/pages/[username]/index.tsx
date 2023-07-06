import CurrentJobsTable from "@/components/tables/CurrentJobsTable";
import EditableTranscriptsTable from "@/components/tables/EditableTranscriptsTable";
import PastJobsTable from "@/components/tables/PastJobsTable";
import { Heading } from "@chakra-ui/react";

export default function Profile() {
  return (
    <>
      <Heading size="md" mb={6}>
        My Account
      </Heading>
      <EditableTranscriptsTable />
      <CurrentJobsTable />
      <PastJobsTable />
    </>
  );
}
