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
          <motion.div
            className="absolute inset-0 top-[var(--header-height)] z-50 bg-background-primary"
            initial={{ y: -3, transitionTimingFunction: "ease-in" }}
            animate={{ y: 0, transitionTimingFunction: "ease-in" }}
          >
            <div className="flex h-[calc(100vh-var(--header-height))] w-full flex-col gap-2 overflow-auto px-6 py-4">
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

  const currentRoute =
    pageMeta.data[
      folderChildren.find((item) => item.route === router.pathname)?.name
    ] || "Index";

  const { isMobile } = useWindowSize(768);

  return (
    <>
      <Head>
        <title>{pageOpts.title}</title>
        <meta name="og:image" content={pageOpts.frontMatter.image} />
      </Head>
      <div className="flex flex-col md:flex-row">
        {isMobile && (
          <div>
            <header
              className="flex flex-col gap-1 border-b-[0.025rem] border-neutral-stroke px-6 pt-3 md:px-3"
              ref={ref}
            >
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">Evently</h1>
                <Divider
                  orientation="vertical"
                  className="text h-6 w-[0.125rem]"
                />
                <p className="text-[#8a8f98]">Design</p>
              </div>
              <div
                style={{
                  ["--header-height" as string]: `${bounds.height}px`,
                }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">{currentRoute}</h2>
                  <Hamburger size={24} toggled={isOpen} onToggle={setIsOpen} />
                </div>
                <MobileMenu
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  folderChildren={folderChildren}
                  pageMeta={pageMeta}
                />
              </div>
            </header>
          </div>
        )}
        {!isMobile && (
          <div className="h-screen w-56 border-r-[0.025rem] border-neutral-stroke px-4 py-4">
            <header className="sticky top-0 flex items-center gap-2 py-3 px-3">
              <p className="text-xl font-medium">Evently</p>
              <Divider
                orientation="vertical"
                className="text h-6 w-[0.125rem]"
              />
              <p className="text-[#8a8f98]">Design</p>
            </header>
            <div className="flex w-full flex-col gap-2">
              {folderChildren.map((item: MdxFile) => (
                <Link
                  key={item.name}
                  href={item.route}
                  className={cn(
                    router.pathname === item.route && "bg-[#222326]",
                    "w-full rounded-md px-3 py-1 transition-all hover:bg-[#222326]"
                  )}
                >
                  {pageMeta.data[item.name]}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="flex w-full justify-center p-6">
          <div className="w-full lg:w-3/4">
            {currentRoute && (
              <>
                <h2 className="text-2xl font-medium">{currentRoute}</h2>
                <Divider className="my-4" />
              </>
            )}
            {children}
          </div>
        </div>
      </div>
    </>
  );

  // return (
  //   <>
  //     <Head>
  //       <title>{pageOpts.title}</title>
  //       <meta name="og:image" content={pageOpts.frontMatter.image} />
  //     </Head>
  //     <div
  //       style={{
  //         ["--header-height" as string]: `${bounds.height}px`,
  //         ["--height" as string]: `calc(100vh - var(--header-height))`,
  //       }}
  //     >
  //       <header
  //         className="flex items-center justify-between border-b-[0.025rem] border-b-neutral-stroke px-6 py-4"
  //         ref={ref}
  //       >
  //         <div>
  //           <h1 className="text-lg font-medium">AccelerateUI</h1>
  //           <p className="text-sm">The Design System for Evently</p>
  //         </div>
  //         {isMobile && (
  //           <Hamburger
  //             toggled={isOpen}
  //             onToggle={() => setIsOpen((open) => !open)}
  //           />
  //         )}
  //       </header>
  //       {isMobile && (
  //         <MobileMenu
  //           setIsOpen={setIsOpen}
  //           folderChildren={folderChildren}
  //           pageMeta={pageMeta}
  //           isOpen={isOpen}
  //         />
  //       )}
  //       <div className="flex">
  //         {!isMobile && (
  //           <div className="flex h-[var(--height)] w-max flex-col gap-4 overflow-x-hidden overflow-y-scroll border-r-[0.025rem] border-r-neutral-stroke px-6 py-6">
  //             {folderChildren.map((item: MdxFile) => (
  //               <Link
  //                 key={item.name}
  //                 href={item.route}
  //                 className={cn(
  //                   router.pathname === item.route && "bg-neutral-700",
  //                   "w-max rounded-md px-3 py-1 transition-all hover:bg-neutral-700"
  //                 )}
  //               >
  //                 {pageMeta.data[item.name]}
  //               </Link>
  //             ))}
  //           </div>
  //         )}
  //         <div className="flex w-full justify-center p-6">
  //           <div className="w-full lg:w-3/4">
  //             <h2 className="text-lg font-medium">
  //               {
  //                 pageMeta.data[
  //                   folderChildren.find(
  //                     (item) => item.route === router.pathname
  //                   )?.name
  //                 ]
  //               }
  //             </h2>
  //             <Divider className="my-4" />
  //             {children}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}
