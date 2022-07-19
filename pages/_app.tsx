import "../styles/globals.css";
import "../styles/variables.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import { SessionProvider } from "next-auth/react";
import AuthUIHandler from "../components/authUIHandler/AuthUIHandler";
import { Provider as StoreProvider } from "react-redux";
import { store } from "../store";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <StoreProvider store={store}>
        <AuthUIHandler>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthUIHandler>
      </StoreProvider>
    </SessionProvider>
  );
}
