/* eslint-disable @next/next/no-img-element */
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { ScrollArea } from "@/shared-components/system/scroll-area";
import { BaseQueryCell } from "@/shared-components/util/base-query-cell";
import { LoadingSpinner } from "@/shared-components/util/spinner";
import { CustomNextPage } from "@/types/next-page";
import { NewOrganizationModal } from "@/ui/org/new-org";
import { switchAccount } from "@/utils/switch-account";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { FaChevronRight, FaGoogle } from "react-icons/fa";

const Splash: React.FC = () => (
  <section className="flex h-screen flex-col items-center justify-center p-8">
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Heading className="text-4xl">MeetXL</Heading>
        <p className="max-w-xl text-2xl">
          <span className="opacity-70">
            Hosting a meeting shouldn&apos;t be difficult.{" "}
          </span>
          <span className="font-semibold opacity-90">
            Meeting management made easy.
          </span>
        </p>
      </div>

      <Button
        size="md"
        icon={<FaGoogle />}
        className="w-full"
        onClick={() => signIn("google")}
      >
        Continue with Google
      </Button>
      <p className="max-w-xl text-xs opacity-50">
        MeetXL is currently in an extremely alpha stage. By clicking
        &quot;Continue with Google&quot; you acknowledge that your data may be
        erased at any time without prior notice. It is not recommended to use
        this service for any important data.
      </p>
    </div>
  </section>
);

const SelectOrgLoading: React.FC = () => (
  <Card className="w-full max-w-md p-0">
    <ScrollArea className="h-96">
      <ul className="flex flex-col gap-2">
        {[...new Array(8)].map((_, idx) => (
          <li key={idx}>
            <div className="flex items-center justify-between border-b-[0.025rem] border-accent-stroke px-4 py-3">
              <div className="flex flex-col gap-2">
                <div className="h-3 w-12 animate-pulse rounded-sm bg-accent-stroke" />
                <div className="h-4 w-16 animate-pulse rounded-sm bg-accent-stroke" />
              </div>
              <FaChevronRight />
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  </Card>
);

const SelectOrg: React.FC<{ session: Session }> = (props) => {
  const orgsQuery = trpc.organization.list.useQuery();

  return (
    <section className="flex h-screen flex-col items-center justify-center gap-6 p-8">
      <BaseQueryCell
        query={orgsQuery}
        loading={SelectOrgLoading}
        success={({ data }) => {
          if (data.length > 0) {
            return (
              <>
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center gap-2">
                    <Heading level="h3" className="opacity-40">
                      MeetXL
                    </Heading>
                    <Heading>Welcome, {props.session.user?.name}</Heading>
                  </div>
                  <p className="text-sm opacity-70">
                    Please choose an organization from below
                  </p>
                </div>
                <Card className="w-full max-w-md p-0 shadow-md shadow-accent-stroke">
                  <ScrollArea className="h-96 w-full">
                    <ul className="flex flex-col gap-2">
                      {data.map((org, idx) => (
                        <li key={org.id}>
                          <Link href={`/${org.slug}`}>
                            <div
                              className={clsx(
                                "flex items-center justify-between px-4 py-3 transition-colors hover:bg-background-dark",
                                idx !== data.length &&
                                  "border-b-[0.025rem] border-accent-stroke"
                              )}
                            >
                              <div>
                                <p className="text-sm opacity-50">{org.slug}</p>
                                <p className="text-lg font-medium">
                                  {org.name}
                                </p>
                              </div>
                              <FaChevronRight />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </Card>
              </>
            );
          }

          return (
            <>
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-2">
                  <Heading level="h3" className="opacity-40">
                    MeetXL
                  </Heading>
                  <Heading>Welcome, {props.session.user?.name}</Heading>
                </div>
                <p className="text-sm opacity-70">
                  Please create or join a new organization below
                </p>
              </div>
              <NewOrganizationModal
                customButton={(setIsOpen, setMode) => (
                  <div className="flex flex-col gap-2">
                    <Button
                      size="lg"
                      className=" w-80 flex-row-reverse justify-between gap-2"
                      icon={<FaChevronRight />}
                      onClick={() => {
                        setMode("join");
                        setIsOpen(true);
                      }}
                    >
                      Join a New Organization
                    </Button>
                    <Button
                      size="lg"
                      className=" w-80 flex-row-reverse justify-between gap-2"
                      icon={<FaChevronRight />}
                      onClick={() => {
                        setMode("create");
                        setIsOpen(true);
                      }}
                    >
                      Create a New Organization
                    </Button>
                  </div>
                )}
              />
            </>
          );
        }}
      />

      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-sm opacity-80">Not {props.session.user?.name}?</p>
        <div className="ml-[-0.5rem] flex items-center gap-2 opacity-95">
          <Button onClick={() => switchAccount()} variant="ghost">
            Switch
          </Button>
          <Button onClick={() => signOut()} variant="ghost">
            Sign Out
          </Button>
        </div>
      </div>
    </section>
  );
};

const Home: CustomNextPage = () => {
  const session = useSession();

  return (
    <>
      <Head>
        <title>MeetXL</title>
        <meta property="og:title" content="MeetXL" />
        <meta property="og:site_name" content="MeetXL" />
        <meta property="og:type" content="website" />
        <meta content="summary_large_image" property="twitter:card" />
        <meta content="/banner.svg" property="og:image" />
        <meta
          content="Event and meeting management, made easy"
          property="og:description"
        />
        <meta name="theme-color" content="#bb71ee" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {session.status === "loading" && <LoadingSpinner />}
        {session.status === "unauthenticated" && <Splash />}
        {session.status === "authenticated" && (
          <SelectOrg session={session.data} />
        )}
      </main>
    </>
  );
};

export default Home;
