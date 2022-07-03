import "../styles/globals.css";
import "../styles/variables.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import { SessionProvider } from "next-auth/react";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
