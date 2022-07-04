import "../styles/globals.css";
import "../styles/variables.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import { SessionProvider } from "next-auth/react";
import AuthUIHandler from "../components/authUIHandler/AuthUIHandler";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthUIHandler>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthUIHandler>
    </SessionProvider>
  );
}
