import "../styles/globals.css";
import "../styles/variables.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import AuthUIHandler from "../components/authUIHandler/AuthUIHandler";
import { Provider as StoreProvider } from "react-redux";
import { store } from "../store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tippy.js/dist/tippy.css";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <StoreProvider store={store}>
      <AuthUIHandler>
        <Layout>
          <ToastContainer />
          <Component {...pageProps} />
        </Layout>
      </AuthUIHandler>
    </StoreProvider>
  );
}
