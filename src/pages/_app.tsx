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

const AppInner: React.FC<React.PropsWithChildren<CustomComponent>> = ({
  Component,
  ...props
}) => {
  if (Component.auth) {
    return <Auth>{props.children}</Auth>;
  }

  return <>{props.children}</>;
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
