"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/logo";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/session", label: "Session" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <Container>
        <div className="h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Logo href="/dashboard" />
            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => {
                const active =
                  pathname === l.href || pathname.startsWith(l.href + "/");
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 h-8 inline-flex items-center rounded-full text-sm transition-colors ${
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden sm:inline-flex h-9 items-center gap-2 px-3 rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-foreground/20 text-sm transition-colors"
              aria-label="Search"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m20 20-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Search</span>
              <kbd className="ml-2 text-[10px] font-mono border border-border rounded px-1.5 py-0.5 text-muted-foreground">
                ⌘K
              </kbd>
            </button>
            <Button href="/session" size="sm">
              New session
            </Button>
            <div
              className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-blue-500 flex items-center justify-center text-white text-sm font-semibold"
              aria-label="Account"
            >
              A
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
