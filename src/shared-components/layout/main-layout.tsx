import { Tab } from "@/types/tab";
import { OrgContext } from "@/ui/org/org-shell";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useContext } from "react";
import { FaChevronDown, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { Avatar } from "../system/avatar";
import { Button } from "../system/button";
import { Heading } from "../system/heading";
import { transitionClasses } from "../system/transition";
import { ContentWrapper } from "./content-wrapper";

const isSelected = (tab: Tab, path: string) => {
  if (tab.route.endsWith("/*")) {
    console.log(path, tab.route);
    return path.startsWith(tab.route.replace("/*", ""));
  }

  return path === tab.route;
};

const OptionsMenu: React.FC<{ className: string }> = (props) => {
  const { data: session } = useSession();

  return (
    <Menu
      as="div"
      className={clsx("relative inline-block text-left", props.className)}
    >
      <Menu.Button
        as={Button}
        variant="ghost"
        size="sm"
        className="hover:bg-background-primary"
      >
        <Avatar
          imageProps={{ src: session?.user?.image as string }}
          fallbackProps={{
            children: getAvatarFallback(session?.user?.name as string),
          }}
        />
      </Menu.Button>
      <Transition as={Fragment} {...transitionClasses}>
        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 divide-y divide-red-400 rounded-md border-[0.0125rem] border-accent-stroke bg-background-dark shadow-xl">
          <div className="flex flex-col gap-2 p-2">
            <Menu.Item as="div" className="flex items-center gap-2 p-2">
              <Avatar
                imageProps={{ src: session?.user?.image as string }}
                fallbackProps={{
                  children: getAvatarFallback(session?.user?.name as string),
                }}
              />
              <div>
                <p>{session?.user?.name}</p>
                <p className="opacity-75">{session?.user?.email}</p>
              </div>
            </Menu.Item>
            <hr className="border-accent-stroke" />
            <Menu.Item
              as={Button}
              variant="ghost"
              icon={<FaUsers />}
              centered={false}
              onClick={() => {
                signOut();
                signIn("google", { callbackUrl: "/dashboard" });
              }}
            >
              Switch Accounts
            </Menu.Item>
            <Menu.Item
              as={Button}
              variant="ghost"
              centered={false}
              icon={<FaSignOutAlt />}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const MainLayout: React.FC<
  React.PropsWithChildren<{
    tabs?: Tab[];
  }>
> = (props) => {
  const router = useRouter();
  const org = useContext(OrgContext);

  return (
    <>
      <Head>
        <title>
          {org?.org?.name || "MeetXL"} -{" "}
          {props.tabs?.find((item) => isSelected(item, router.pathname))?.name}
        </title>
        <meta property="og:title" content="MeetXL" />
        <meta property="og:site_name" content="MeetXL" />
        <meta property="og:type" content="website" />
        <meta content="summary_large_image" property="twitter:card" />
        <meta content="/banner.png" property="og:image" />
        <meta
          content="Event and meeting management, made easy"
          property="og:description"
        />
        <meta name="theme-color" content="#bb71ee" />
      </Head>
      <main>
        <header className="sticky top-0 z-10 bg-background-primary">
          <ContentWrapper className="relative flex h-full flex-col gap-6 pb-1 lg:py-5">
            <nav className="sticky flex items-center justify-between">
              <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
                <div className="flex w-full items-center justify-between gap-4 md:w-min">
                  <Heading className="flex items-center gap-5" level="h3">
                    <Link href="/dashboard" passHref>
                      <a className="flex h-8 w-8 items-center">
                        <img src="/symbol-alt-2.svg" alt="logo" />
                      </a>
                    </Link>
                    {router.query.org && (
                      <Link href={`/${router.query.org}`} passHref>
                        <a className="flex gap-3">
                          <span className="text-md font-light opacity-30">
                            /
                          </span>
                          <span>{router.query.org}</span>
                        </a>
                      </Link>
                    )}
                    {router.query.org && router.query.meeting && (
                      <Link
                        href={`/${router.query.org}/${router.query.meeting}`}
                        passHref
                      >
                        <a className="flex gap-3">
                          <span className="text-md font-light opacity-30">
                            /
                          </span>
                          <span>{router.query.meeting}</span>
                        </a>
                      </Link>
                    )}
                  </Heading>
                  <OptionsMenu className="block md:hidden" />
                  {/* <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    size="sm"
                    className="block md:hidden"
                  >
                    Log Out
                  </Button> */}
                </div>
                <ul className="flex flex-wrap gap-4">
                  {props.tabs
                    ?.filter(
                      (item) =>
                        !item.adminRequired ||
                        (item.adminRequired &&
                          org?.org?.member?.role === "ADMIN")
                    )
                    .map((item) => (
                      <Link
                        href={{
                          pathname: item.route.replace("*", ""),
                          query: (() => {
                            if (router.query.org) {
                              if (router.query.meeting) {
                                return {
                                  org: router.query.org,
                                  meeting: router.query.meeting,
                                };
                              }

                              return { org: router.query.org };
                            }

                            return router.query;
                          })(),
                        }}
                        key={item.name}
                        passHref
                      >
                        <a
                          className={clsx(
                            "rounded-md py-2 px-4 leading-none transition-all",
                            isSelected(item, router.pathname) &&
                              " bg-accent-primary bg-opacity-30",
                            !isSelected(item, router.pathname) &&
                              "opacity-70 hover:bg-accent-secondary hover:opacity-100"
                          )}
                        >
                          <li>{item.name}</li>
                          <hr className="absolute bottom-0 border-red-200" />
                        </a>
                      </Link>
                    ))}
                </ul>
              </div>
              {/* <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                size="sm"
                className="hidden w-36 md:inline-block"
              >
                Log Out
              </Button> */}
              <OptionsMenu className="hidden md:inline-block" />
            </nav>
          </ContentWrapper>
        </header>
        <ContentWrapper>{props.children}</ContentWrapper>
      </main>
    </>
  );
};
