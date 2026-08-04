import { ArrowRight, Menu } from "lucide-react";

import { useSignup } from "@/components/signup-context";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavigationProps {
  links: Array<{ href: string; label: string }>;
  signupSource: string;
}

export function MobileNavigation({ links, signupSource }: MobileNavigationProps) {
  const { openSignup } = useSignup();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="mobile-nav-trigger lg:hidden" type="button" aria-label="Open menu">
          <Menu aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="mobile-nav-drawer"
        overlayClassName="mobile-nav-overlay"
      >
        <SheetHeader className="mobile-nav-heading">
          <div className="mobile-nav-brand">
            <img src="/last-hit/crest.webp" alt="" width={52} height={52} />
            <div>
              <p className="eyebrow">Guild dispatch</p>
              <SheetTitle>Last Hit</SheetTitle>
            </div>
          </div>
          <SheetDescription>
            Explore the game, meet the monsters, or choose the news you want.
          </SheetDescription>
        </SheetHeader>

        <nav className="mobile-nav-links" aria-label="Mobile navigation">
          {links.map(({ href, label }, index) => (
            <SheetClose asChild key={href}>
              <a href={href}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
                <ArrowRight aria-hidden="true" />
              </a>
            </SheetClose>
          ))}
        </nav>

        <div className="mobile-nav-follow">
          <p>Choose Announcements, Playtesting, or both.</p>
          <SheetClose asChild>
            <button
              className="button button-gold"
              type="button"
              onClick={() => openSignup({ source: signupSource, preset: "updates" })}
            >
              Follow Last Hit <ArrowRight aria-hidden="true" />
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
