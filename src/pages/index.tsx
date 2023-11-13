/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next";
import type { Session } from "next-auth";
import LandingPage from "@/components/home/LandingPage";

export type HomePageProps = {
  serverSession: Session | null;
};

const Home: NextPage<HomePageProps> = () => {
  return <LandingPage />;
};

export default Home;
