import Footer from "@/components/footer/Footer";
import GlobalContainer from "@/components/GlobalContainer";
import useNoContainerLimit from "@/hooks/useNoContainerLimit";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "./layout.module.css";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar/Navbar";
import config from "@/config/config.json";
import Script from "next/script";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isReviewSite, setIsReviewSite] = useState(false);
  const { noRestriction } = useNoContainerLimit();
  const router = useRouter();
  const isHomePage = router.asPath === "/";
  const isHomeRouter = router.asPath === "/home";

  useEffect(() => {
    setIsReviewSite(window.location.href.includes(config.prod_url));
  }, []);

  return (
    <>
      <div className={styles.app_container}>
        <Head>
          <title>Bitcoin Transcripts Reviews</title>
          <meta
            name="description"
            content="Review Technical Bitcoin Transcripts and Earn Sats"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="./btctranscripts.png" />
          <meta
            property="og:image"
            content="https://review.btctranscripts.com/btctranscripts.png"
          ></meta>
          <meta
            property="og:title"
            content="Bitcoin Transcripts Reviews"
          ></meta>
          <meta
            property="og:url"
            content="https://review.btctranscripts.com"
          ></meta>
          <meta
            property="og:description"
            content="Review Technical Bitcoin Transcripts and Earn Sats"
          ></meta>
          <meta name="twitter:card" content="summary"></meta>
          <meta
            name="twitter:image"
            content="https://review.btctranscripts.com/btctranscripts.png"
          ></meta>
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
        {!isHomePage && !isHomeRouter && <Footer />}
        {isReviewSite && (
          <Script
            async
            src="https://visits.bitcoindevs.xyz/script.js"
            data-website-id="d9b96a7b-a2db-4ef1-9360-69d3b288859d"
          ></Script>
        )}
      </div>
    </>
  );
};

export default Layout;
