// src/pages/_app.tsx
import { Auth } from "@/shared-components/util/auth";
import { CustomNextPage } from "@/types/next-page";
import { trpc } from "@/utils/trpc";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "../styles/globals.css";

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
    return <Auth>{getLayout(<>{props.children}</>)}</Auth>;
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
