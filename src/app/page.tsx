import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { MarketingNav } from "@/components/marketing-nav";
import { ScenarioCard } from "@/components/scenario-card";
import { scenarios } from "@/lib/scenarios";

export default function Home() {
  return (
    <>
      <MarketingNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient pointer-events-none" />
          <div className="absolute inset-0 grid-pattern opacity-[0.35] pointer-events-none" />
          <Container className="relative py-24 sm:py-32">
            <div className="flex flex-col items-center text-center">
              <Badge tone="brand" className="mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                AI sales call simulator
              </Badge>
              <h1 className="max-w-3xl text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
                Practice the call before
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent">
                  {" "}it matters.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                RolePlay is a voice-based training ground for sales reps. Run
                realistic cold calls, discovery, objection handling, and
                closing conversations with an AI prospect — and get coached
                after every rep.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
                <Button href="/session" size="lg">
                  Start Practice
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14m0 0-5-5m5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
                <Button href="/scenarios" size="lg" variant="secondary">
                  View Scenarios
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                No setup. No headset. Your first call runs in your browser.
              </p>
            </div>

            {/* Hero device mock */}
            <div className="relative mt-20 max-w-4xl mx-auto">
              <div className="absolute -inset-x-10 -top-10 h-40 bg-brand/10 blur-3xl rounded-full pointer-events-none" />
              <Card className="relative overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    roleplay.app / session
                  </div>
                  <div className="w-10" />
                </div>
                <div className="grid md:grid-cols-[1fr_280px] min-h-[320px]">
                  <div className="p-6 space-y-4 border-b md:border-b-0 md:border-r border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">
                          Live call
                        </div>
                        <div className="text-[15px] font-semibold mt-0.5">
                          Discovery · Director of RevOps
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Connected
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <TranscriptBubble
                        speaker="AI Prospect"
                        align="left"
                      >
                        We&rsquo;re already using something for this. What makes you different?
                      </TranscriptBubble>
                      <TranscriptBubble speaker="You" align="right">
                        Totally fair. Mind if I ask what prompted you to take this call?
                      </TranscriptBubble>
                      <TranscriptBubble
                        speaker="AI Prospect"
                        align="left"
                        typing
                      />
                    </div>
                  </div>
                  <div className="p-6 bg-muted/50">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Live coaching
                    </div>
                    <ul className="mt-3 space-y-3 text-sm">
                      <CoachItem tone="success" label="Pacing">
                        Good — 142 wpm
                      </CoachItem>
                      <CoachItem tone="success" label="Questions">
                        Open-ended, following up
                      </CoachItem>
                      <CoachItem tone="warning" label="Talk ratio">
                        62% — ease up slightly
                      </CoachItem>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* Value props */}
        <section className="py-20 sm:py-28 border-t border-border">
          <Container>
            <div className="max-w-2xl">
              <div className="text-sm font-medium text-brand">
                Built for sales teams
              </div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
                Reps get better by repping.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Instead of shadowing senior reps or waiting for manager 1:1s,
                your team can run realistic calls on demand — and come to the
                pipeline review already warmed up.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-5">
              <FeatureCard
                title="Realistic AI prospects"
                description="Personas react, push back, and stall like real buyers. No canned scripts."
              />
              <FeatureCard
                title="Instant coaching"
                description="Feedback on pacing, discovery depth, objection handling, and close — after every rep."
              />
              <FeatureCard
                title="Scenarios for every stage"
                description="From cold opener to multi-threaded close. Match the rep to the reality."
              />
            </div>
          </Container>
        </section>

        {/* Scenarios preview */}
        <section className="py-20 sm:py-28 border-t border-border">
          <Container>
            <div className="flex items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  Pick a scenario. Start talking.
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Four starter scenarios, each with a distinct persona and
                  difficulty. More coming as we build out the library.
                </p>
              </div>
              <Button href="/scenarios" variant="secondary" size="md">
                See all
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {scenarios.map((s) => (
                <ScenarioCard key={s.id} scenario={s} />
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24 border-t border-border">
          <Container>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 hero-gradient opacity-70 pointer-events-none" />
              <div className="relative px-8 py-14 sm:px-14 sm:py-20 flex flex-col items-center text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-2xl">
                  Your next call is practice — whether you want it to be or not.
                </h2>
                <p className="mt-4 max-w-xl text-muted-foreground">
                  Spend five minutes in RolePlay before the real one.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button href="/session" size="lg">
                    Start Practice
                  </Button>
                  <Button href="/dashboard" size="lg" variant="secondary">
                    Open dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} RolePlay. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </Container>
      </footer>
    </>
  );
}

function TranscriptBubble({
  speaker,
  align,
  typing,
  children,
}: {
  speaker: string;
  align: "left" | "right";
  typing?: boolean;
  children?: React.ReactNode;
}) {
  const isRight = align === "right";
  return (
    <div className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] ${
          isRight
            ? "bg-foreground text-background"
            : "bg-muted text-foreground border border-border"
        } rounded-2xl px-4 py-2.5`}
      >
        <div
          className={`text-[10px] uppercase tracking-wide mb-0.5 ${
            isRight ? "text-background/60" : "text-muted-foreground"
          }`}
        >
          {speaker}
        </div>
        {typing ? (
          <div className="flex items-center gap-1 h-5">
            <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
          </div>
        ) : (
          <div className="leading-6">{children}</div>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-pulse"
      style={{ animationDelay: delay }}
    />
  );
}

function CoachItem({
  tone,
  label,
  children,
}: {
  tone: "success" | "warning";
  label: string;
  children: React.ReactNode;
}) {
  const dot =
    tone === "success"
      ? "bg-emerald-500"
      : "bg-amber-500";
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1.5 h-2 w-2 rounded-full ${dot}`} />
      <div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div>{children}</div>
      </div>
    </li>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6">
      <CardBody className="p-0">
        <h3 className="text-[17px] font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardBody>
    </Card>
  );
}
