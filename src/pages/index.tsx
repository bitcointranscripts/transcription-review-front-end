/* eslint-disable react/no-unescaped-entities */
import HomePage from "@/components/home/Queuer";
import HomePageTutorial from "@/components/home/Tutorial";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  if (session.status === "authenticated") {
    return <HomePage />;
  }

  if (session.status === "unauthenticated") {
    return <HomePageTutorial />;
  }

  return null;
}
