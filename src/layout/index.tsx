import Footer from "@/components/footer/Footer";
import GlobalContainer from "@/components/GlobalContainer";
import Navbar from "@/components/navbar/Navbar";
import useNoContainerLimit from "@/hooks/useNoContainerLimit";
import Head from "next/head";
import React from "react";
import styles from "./layout.module.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { noRestriction } = useNoContainerLimit();
  return (
    <div className={styles.app_container}>
      <Head>
        <title>Bitcoin Transcription Reviews</title>
        <meta name="description" content="Bitcoin Transcription Review" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./btc-transcript-circle-128.png" />
      </Head>
      <Navbar />
      <GlobalContainer
        flexGrow={1}
        py={4}
        mt={12}
        {...(noRestriction ? { maxW: "none", p: 0 } : {})}
      >
        {children}
      </GlobalContainer>
      <Footer />
    </div>
  );
};

export default Layout;
