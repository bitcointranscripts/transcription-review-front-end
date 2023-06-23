/* eslint-disable react/no-unescaped-entities */
import HomePage from "@/components/home/Queuer";
import HomePageTutorial from "@/components/home/Tutorial";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

type HomePageProps = {
  serverSession: Session | null;
};

const Home: NextPage<HomePageProps> = ({ serverSession }) => {
  if (serverSession) {
    return <HomePage />;
  }

  return <HomePageTutorial />;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  return {
    props: {
      serverSession: session,
    },
  };
};

export default Home;
