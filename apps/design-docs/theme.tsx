import { Button, Divider, cn } from "@meetxl/ui";
import useWindowSize from "@meetxl/ui/src/hooks/use-window-size";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { MdxFile, NextraThemeLayoutProps, PageMapItem } from "nextra";
import React, { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { Cross as Hamburger } from "hamburger-react";

const MobileMenu: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  folderChildren: any[];
  pageMeta: any;
}> = (props) => {
  const router = useRouter();

  return (
    <>
      <AnimatePresence>
        {props.isOpen && (
          <motion.div className="absolute inset-0 top-[var(--header-height)] z-10 bg-background-primary">
            <div className="flex w-full flex-col gap-2 px-6 py-4">
              {props.folderChildren.map((item: MdxFile) => (
                <Link
                  onClick={() => {
                    props.setIsOpen(false);
                  }}
                  key={item.name}
                  href={item.route}
                  className={cn(
                    router.pathname === item.route && "bg-neutral-700",
                    "w-full rounded-md px-3 py-1 transition-all hover:bg-neutral-700"
                  )}
                >
                  {props.pageMeta.data[item.name]}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function Layout({ children, pageOpts }: NextraThemeLayoutProps) {
  const [ref, bounds] = useMeasure();
  const { pageMap } = pageOpts;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  let folderChildren = pageMap
    .filter((item) => item.kind === "Folder")
    .flatMap((item) => (item as any).children);

  const pageMeta = folderChildren.find((item) => item.kind === "Meta");
  folderChildren = folderChildren.filter((item) => item.kind === "MdxPage");

  const { isMobile } = useWindowSize();

  return (
    <>
      <Head>
        <title>{pageOpts.title}</title>
        <meta name="og:image" content={pageOpts.frontMatter.image} />
      </Head>
      <div
        style={{
          ["--header-height" as string]: `${bounds.height}px`,
          ["--height" as string]: `calc(100vh - var(--header-height))`,
        }}
      >
        <header
          className="flex items-center justify-between border-b-[0.025rem] border-b-neutral-stroke px-6 py-4"
          ref={ref}
        >
          <div>
            <h1 className="text-lg font-medium">AccelerateUI</h1>
            <p className="text-sm">The Design System for Evently</p>
          </div>
          {isMobile && (
            <Hamburger
              toggled={isOpen}
              onToggle={() => setIsOpen((open) => !open)}
            />
          )}
        </header>
        {isMobile && (
          <MobileMenu
            setIsOpen={setIsOpen}
            folderChildren={folderChildren}
            pageMeta={pageMeta}
            isOpen={isOpen}
          />
        )}
        <div className="flex">
          {!isMobile && (
            <div className="flex h-[var(--height)] w-max flex-col gap-4 overflow-x-hidden overflow-y-scroll border-r-[0.025rem] border-r-neutral-stroke px-6 py-6">
              {folderChildren.map((item: MdxFile) => (
                <Link
                  key={item.name}
                  href={item.route}
                  className={cn(
                    router.pathname === item.route && "bg-neutral-700",
                    "w-max rounded-md px-3 py-1 transition-all hover:bg-neutral-700"
                  )}
                >
                  {pageMeta.data[item.name]}
                </Link>
              ))}
            </div>
          )}
          <div className="flex w-full justify-center p-6">
            <div className="w-full lg:w-3/4">
              <h2 className="text-lg font-medium">
                {
                  pageMeta.data[
                    folderChildren.find(
                      (item) => item.route === router.pathname
                    )?.name
                  ]
                }
              </h2>
              <Divider className="my-4" />
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
