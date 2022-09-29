import { Tab } from "@/types/tab";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../system/button";
import { Heading } from "../system/heading";
import { ContentWrapper } from "./content-wrapper";

export const MainLayout: React.FC<
  React.PropsWithChildren<{ heading?: string; tabs?: Tab[]; admin?: boolean }>
> = (props) => {
  const router = useRouter();

  return (
    <main>
      <header
        className={clsx(
          "border-b-[1px] border-accent-stroke bg-background-secondary",
          props.tabs && "h-28"
        )}
      >
        <ContentWrapper className="relative flex h-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Heading className="flex items-center gap-3" level="h3">
                <Link href="/dashboard">MeetXL</Link>
                {props.heading && (
                  <Link href={`/${props.heading}`} passHref>
                    <a className="flex gap-3">
                      <span className="text-md font-light opacity-30">/</span>
                      <span>{props.heading}</span>
                    </a>
                  </Link>
                )}
              </Heading>
            </div>
            <Button onClick={() => signOut()} size="sm">
              Log Out
            </Button>
          </div>
          <nav className="absolute bottom-0 flex gap-4">
            {props.tabs
              ?.filter(
                (item) =>
                  !item.adminRequired || (item.adminRequired && props.admin)
              )
              .map((item) => (
                <Link
                  href={{ pathname: item.route, query: router.query }}
                  key={item.name}
                  passHref
                >
                  <a
                    className={clsx(
                      "tran px-4 py-2 leading-none transition-all",
                      router.pathname === item.route &&
                        "border-b-2 border-accent-primary",
                      router.pathname !== item.route &&
                        "opacity-70 hover:border-b-2 hover:border-purple-400 hover:opacity-100"
                    )}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
          </nav>
        </ContentWrapper>
      </header>
      <ContentWrapper>{props.children}</ContentWrapper>
    </main>
  );
};
