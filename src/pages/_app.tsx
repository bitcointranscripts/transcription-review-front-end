import theme from "@/chakra/chakra-theme";
import Layout from "@/layout";
import { ApiProvider } from "@/services/api/provider";
import "@/styles/globals.css";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // reset chakra-ui local storage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      let currentColorMode = window.localStorage.getItem(
        "chakra-ui-color-mode"
      );
      if (currentColorMode === "dark") {
        window.localStorage.removeItem("chakra-ui-color-mode");
      }
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="light" />
      <ApiProvider>
        <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </ApiProvider>
    </ChakraProvider>
  );
}
