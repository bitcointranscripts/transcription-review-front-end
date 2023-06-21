/* eslint-disable react/no-unescaped-entities */
import HomePage from "@/components/home/Queuer";
import HomePageTutorial from "@/components/home/Tutorial";
import QueueTable from "@/components/tables/QueueTable";
import { Box, Heading, Text, Link } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();
  // const router = useRouter();
  // useEffect(() => {
  //   if (session.status === "unauthenticated") {
  //     router.push("/home");
  //   }
  // }, [session, router]);

  if (session.status === "unauthenticated") {
    return <HomePageTutorial />;
  }

  return <HomePage />;
}
