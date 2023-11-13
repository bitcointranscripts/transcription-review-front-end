/* eslint-disable react/no-unescaped-entities */
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useEffect } from "react";
import { useRouter } from "next/router";

export type HomePageProps = {
  serverSession: Session | null;
};

const Home: NextPage<HomePageProps> = ({ serverSession }) => {
  const router = useRouter();
  useEffect(() => {
    if (serverSession) {
      router.push(`/${serverSession.user?.githubUsername || "no-user"}`);
    } else {
      router.push("/");
    }
  }, [serverSession, router]);
  if (serverSession) {
    return <></>;
  }
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
