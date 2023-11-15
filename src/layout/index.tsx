import Footer from "@/components/footer/Footer";
import GlobalContainer from "@/components/GlobalContainer";
import useNoContainerLimit from "@/hooks/useNoContainerLimit";
import Head from "next/head";
import React from "react";
import styles from "./layout.module.css";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { noRestriction } = useNoContainerLimit();
  const router = useRouter();
  const isHomePage = router.asPath === "/";
  return (
    <div className={styles.app_container}>
      <Head>
        <title>Bitcoin Transcription Reviews</title>
        <meta name="description" content="Bitcoin Transcription Review" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./btc-transcript-circle-128.png" />
      </Head>
      {!isHomePage && <Navbar />}
      <GlobalContainer
        flexGrow={1}
        py={!isHomePage ? 4 : 0}
        mt={!isHomePage ? 12 : 0}
        {...(noRestriction ? { maxW: "none", p: 0 } : {})}
      >
        {children}
      </GlobalContainer>
      {!isHomePage && <Footer />}
    </div>
    <script async src="https://visits.bitcoindevs.xyz/script.js" data-website-id="d9b96a7b-a2db-4ef1-9360-69d3b288859d"></script>
  );
};

export default Layout;
