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
import { Component } from "lucide-react";

const Logo: React.FC<{ width?: string; height?: string }> = ({
  width = "96",
  height = "48",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 395 99"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M125.551 76V23.6364H160.835V32.7642H136.622V45.2415H159.02V54.3693H136.622V66.8722H160.938V76H125.551ZM207.846 36.7273L194.116 76H181.843L168.113 36.7273H179.619L187.775 64.8267H188.184L196.315 36.7273H207.846ZM233.118 76.767C229.078 76.767 225.601 75.9489 222.686 74.3125C219.788 72.6591 217.555 70.3239 215.987 67.3068C214.419 64.2727 213.635 60.6847 213.635 56.5426C213.635 52.5028 214.419 48.9574 215.987 45.9062C217.555 42.8551 219.763 40.4773 222.609 38.7727C225.473 37.0682 228.831 36.2159 232.683 36.2159C235.274 36.2159 237.686 36.6335 239.919 37.4688C242.169 38.2869 244.129 39.5227 245.8 41.1761C247.487 42.8295 248.8 44.9091 249.737 47.4148C250.675 49.9034 251.143 52.8182 251.143 56.1591V59.1506H217.981V52.4006H240.89C240.89 50.8324 240.55 49.4432 239.868 48.233C239.186 47.0227 238.24 46.0767 237.03 45.3949C235.837 44.696 234.447 44.3466 232.862 44.3466C231.209 44.3466 229.743 44.7301 228.464 45.4972C227.203 46.2472 226.214 47.2614 225.498 48.5398C224.783 49.8011 224.416 51.2074 224.399 52.7585V59.1761C224.399 61.1193 224.757 62.7983 225.473 64.2131C226.206 65.6278 227.237 66.7188 228.567 67.4858C229.896 68.2528 231.473 68.6364 233.297 68.6364C234.507 68.6364 235.615 68.4659 236.621 68.125C237.626 67.7841 238.487 67.2727 239.203 66.5909C239.919 65.9091 240.464 65.0739 240.839 64.0852L250.913 64.75C250.402 67.1705 249.354 69.2841 247.768 71.0909C246.2 72.8807 244.172 74.2784 241.683 75.2841C239.212 76.2727 236.356 76.767 233.118 76.767ZM268.423 53.2955V76H257.531V36.7273H267.912V43.6562H268.372C269.242 41.3722 270.699 39.5653 272.744 38.2358C274.79 36.8892 277.27 36.2159 280.185 36.2159C282.912 36.2159 285.29 36.8125 287.318 38.0057C289.347 39.1989 290.923 40.9034 292.048 43.1193C293.173 45.3182 293.736 47.9432 293.736 50.9943V76H282.844V52.9375C282.861 50.5341 282.247 48.6591 281.003 47.3125C279.759 45.9489 278.045 45.267 275.864 45.267C274.398 45.267 273.102 45.5824 271.977 46.2131C270.869 46.8437 270 47.7642 269.369 48.9744C268.756 50.1676 268.44 51.608 268.423 53.2955ZM325.01 36.7273V44.9091H301.359V36.7273H325.01ZM306.728 27.3182H317.62V63.9318C317.62 64.9375 317.774 65.7216 318.081 66.2841C318.387 66.8295 318.814 67.2131 319.359 67.4347C319.921 67.6562 320.569 67.767 321.302 67.767C321.814 67.767 322.325 67.7244 322.836 67.6392C323.348 67.5369 323.74 67.4602 324.012 67.4091L325.725 75.5142C325.18 75.6847 324.413 75.8807 323.424 76.1023C322.436 76.3409 321.234 76.4858 319.819 76.5369C317.194 76.6392 314.893 76.2898 312.916 75.4886C310.956 74.6875 309.43 73.4432 308.339 71.7557C307.248 70.0682 306.711 67.9375 306.728 65.3636V27.3182ZM345.641 23.6364V76H334.748V23.6364H345.641ZM362.89 90.7273C361.509 90.7273 360.214 90.6165 359.004 90.3949C357.811 90.1903 356.822 89.9261 356.038 89.6023L358.492 81.4716C359.771 81.8636 360.921 82.0767 361.944 82.1108C362.984 82.1449 363.879 81.9063 364.629 81.3949C365.396 80.8835 366.018 80.0142 366.495 78.7869L367.134 77.125L353.046 36.7273H364.501L372.632 65.5682H373.041L381.248 36.7273H392.779L377.515 80.2443C376.782 82.358 375.785 84.1989 374.524 85.767C373.279 87.3523 371.703 88.571 369.793 89.4233C367.884 90.2926 365.583 90.7273 362.89 90.7273Z"
        fill="white"
      />
      <path
        d="M97 50.5C97 77.2858 75.2858 99 48.5 99C21.7142 99 0 77.2858 0 50.5C0 23.7142 21.7142 2 48.5 2C75.2858 2 97 23.7142 97 50.5ZM13.2741 50.5C13.2741 69.9547 29.0453 85.7259 48.5 85.7259C67.9547 85.7259 83.7259 69.9547 83.7259 50.5C83.7259 31.0453 67.9547 15.2741 48.5 15.2741C29.0453 15.2741 13.2741 31.0453 13.2741 50.5Z"
        fill="white"
      />
    </svg>
  );
};

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
      <div
        className="flex flex-col md:flex-row"
        style={{
          ["--header-height" as string]: `${bounds.height}px`,
        }}
      >
        {isMobile && (
          <div>
            <header
              className="flex flex-col gap-1 border-b-[0.025rem] border-neutral-stroke px-6 pt-3 md:px-3"
              ref={ref}
            >
              <div className="flex items-center gap-2">
                <Logo />
                <Divider
                  orientation="vertical"
                  className="text h-6 w-[0.125rem]"
                />
                <p className="text-[#8a8f98]">Design</p>
              </div>
              <div>
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
          <div className="h-screen w-[18rem] overflow-auto border-r-[0.025rem] border-neutral-stroke px-4 py-4">
            <header className="flex items-center gap-3 px-3">
              <Logo width="128" height="64" />
              <Divider
                orientation="vertical"
                className="text h-6 w-[0.125rem]"
              />
              <p className="text-[#8a8f98]">Design</p>
            </header>
            <div className="flex w-full flex-col gap-2">
              <div className="mt-2 flex items-center gap-2 px-3">
                <Component size="1.25rem" className="opacity-80" />
                <p className="text-sm font-semibold opacity-60">Components</p>
              </div>
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
}
