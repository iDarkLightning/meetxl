import { cn } from "@meetxl/ui";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { NextraThemeLayoutProps, PageMapItem } from "nextra";

export default function Layout({ children, pageOpts }: NextraThemeLayoutProps) {
  const { pageMap } = pageOpts;
  const router = useRouter();

  const pages = pageMap.filter((item) => item.kind === "MdxPage");
  const folderChildren = pageMap
    .filter((item) => item.kind === "Folder")
    .flatMap((item) => (item as any).children);

  return (
    <>
      <Head>
        <title>{pageOpts.title}</title>
        <meta name="og:image" content={pageOpts.frontMatter.image} />
      </Head>
      <div className="flex flex-col gap-4 p-8">
        <div className="flex flex-wrap gap-4">
          {[...pages, ...folderChildren].map((item: PageMapItem) => {
            if (item.kind === "MdxPage") {
              return (
                <Link
                  key={item.name}
                  href={item.route}
                  className={cn(
                    router.pathname === item.route && "text-neutral-disco"
                  )}
                >
                  {item.name}
                </Link>
              );
            }

            return null;
          })}
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}
