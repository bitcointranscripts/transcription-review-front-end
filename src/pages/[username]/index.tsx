import CurrentJobsTable from "@/components/tables/CurrentJobsTable";
import PastJobsTable from "@/components/tables/PastJobsTable";
import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { Session } from "next-auth";

export type HomePageProps = {
  serverSession: Session | null;
};

const Profile: NextPage<HomePageProps> = () => {
  return (
    <>
      <Heading size="md" mb={6}>
        My Account
      </Heading>
      <CurrentJobsTable />
      <PastJobsTable />
    </>
  );
};

export default Profile;
