import Link from "next/link";
import { useEffect, useState, type ReactElement } from "react";
import { useBlogContext } from "./blog-context";
import { collectPostsAndNavs } from "./utils/collect";
import { MainLogo } from "../components/Logo/MainLogo";
import { FloatingMenu } from "../components/FloatingMenu/FloatingMenu";

export default function Nav(): ReactElement {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { opts, config } = useBlogContext();
  const { navPages } = collectPostsAndNavs({ opts, config });

  return (
    <>
      {isMounted && (
        <nav>
          {navPages.map((page) => {
            const name = page.frontMatter?.title || page.name;
            if (page.active) {
              return (
                <span key={page.route}>
                  {page.route === "/" ? <MainLogo /> : name}
                </span>
              );
            }
            return (
              <Link key={page.route} href={page.route} passHref legacyBehavior>
                {page.route === "/" ? (
                  <a>
                    <MainLogo />
                  </a>
                ) : (
                  <a style={{ display: "none" }}>{name}</a>
                )}
              </Link>
            );
          })}
          {config.navs?.map((nav) => (
            <Link key={nav.url} href={nav.url} passHref legacyBehavior>
              <a>{nav.name}</a>
            </Link>
          ))}
        </nav>
      )}
      <FloatingMenu />
    </>
  );
}
