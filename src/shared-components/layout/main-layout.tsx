import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "../system/button";
import { Heading } from "../system/heading";
import { ContentWrapper } from "./content-wrapper";

export const MainLayout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <main>
      <header className="h-24 border-b-[1px] border-accent-stroke bg-background-dark">
        <ContentWrapper className="relative flex h-full flex-col justify-center gap-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Heading>MeetXL</Heading>
            </div>
            <Button onClick={() => signOut()} size="sm">
              Log Out
            </Button>
          </div>
          <nav className="absolute bottom-0 flex gap-4"></nav>
        </ContentWrapper>
      </header>
      <ContentWrapper>{props.children}</ContentWrapper>
    </main>
  );
};
