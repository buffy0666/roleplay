import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/logo";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <Container>
        <div className="h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link
              href="/scenarios"
              className="hover:text-foreground transition-colors"
            >
              Scenarios
            </Link>
            <Link
              href="/playbook"
              className="hover:text-foreground transition-colors"
            >
              Playbook
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button href="/dashboard" variant="ghost" size="sm">
              Open app
            </Button>
            <Button href="/session" size="sm">
              Start Practice
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
