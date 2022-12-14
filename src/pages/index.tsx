/* eslint-disable @next/next/no-img-element */
import { Button } from "@/shared-components/system/button";
import { Card } from "@/shared-components/system/card";
import { Heading } from "@/shared-components/system/heading";
import { CustomNextPage } from "@/types/next-page";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { FaGoogle } from "react-icons/fa";

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
        <section className="flex flex-col md:flex-row">
          <div className="flex h-[100vh] min-h-[16rem] min-w-[24rem] flex-1 flex-col items-center justify-center gap-2 bg-[#0b0b0b]">
            <Heading level="h1" className="text-4xl">
              MeetXL
              <sup className="font-mono text-accent-primary">[Beta]</sup>
            </Heading>
            <p className="opacity-80">
              Event and meeting management made easy.
            </p>
          </div>
          <div className="mt-24 flex flex-[3] items-center justify-center px-10 md:mt-12">
            <Card className="mx-auto flex max-w-[30rem] flex-col gap-8 p-8 hover:bg-opacity-100 ">
              <div className="flex flex-col gap-2">
                <Heading level="h1">Welcome</Heading>
                <p className="opacity-75">Please log in to use MeetXL.</p>
              </div>
              {session.status === "unauthenticated" ? (
                <Button
                  variant="primary"
                  size="lg"
                  icon={<FaGoogle />}
                  onClick={() =>
                    signIn("google", { callbackUrl: "/dashboard" })
                  }
                >
                  Continue with Google
                </Button>
              ) : (
                <Button size="lg" variant="primary" href="/dashboard">
                  Go to Dashboard
                </Button>
              )}
            </Card>
          </div>
          <a
            href="https://github.com/idarklightning/meetxl"
            className="absolute bottom-5 right-5 font-medium text-accent-primary"
          >
            GitHub
          </a>
        </section>
      </main>
    </>
  );
};

export default Home;
