// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import { trpc } from "@/utils/trpc";
import { AppProps } from "next/app";
import { CustomNextPage } from "@/types/next-page";
import { Auth } from "@/shared-components/util/auth";
import React from "react";

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
    <SessionProvider session={pageProps.session}>
      <AppInner Component={Component}>
        <Component {...pageProps} />
      </AppInner>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
