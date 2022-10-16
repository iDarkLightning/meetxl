// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "@/utils/trpc";
import { AppProps } from "next/app";
import { CustomNextPage } from "@/types/next-page";
import { Auth } from "@/shared-components/util/auth";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

type CustomComponent = {
  Component: CustomNextPage;
};

type CustomAppProps = AppProps & CustomComponent;

const AppInner = ({
  Component,
  ...props
}: CustomComponent & { children: React.PropsWithChildren["children"] }) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  if (Component.auth) {
    return getLayout(<Auth>{props.children}</Auth>);
  }

  return getLayout(<>{props.children}</>);
};

const MyApp = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <AppInner Component={Component}>
          <Component {...pageProps} />
        </AppInner>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="bg-red-200"
        />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
