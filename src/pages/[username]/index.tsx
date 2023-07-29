import CurrentJobsTable from "@/components/tables/CurrentJobsTable";
import PastJobsTable from "@/components/tables/PastJobsTable";
import { Heading } from "@chakra-ui/react";

export default function Profile() {
  return (
    <>
      <Heading size="md" mb={6}>
        My Account
      </Heading>
      <CurrentJobsTable />
      <PastJobsTable />
    </>
  );
}
