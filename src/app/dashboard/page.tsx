import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { AppNav } from "@/components/app-nav";
import { PlaybookPreview } from "@/components/playbook-preview";
import { ScenarioCard } from "@/components/scenario-card";
import { scenarios } from "@/lib/scenarios";

const recentSessions = [
  {
    id: "s-1041",
    scenario: "Discovery Call",
    persona: "Director of RevOps",
    when: "Today · 2:14 PM",
    duration: "18:42",
    score: 84,
    trend: "+6",
  },
  {
    id: "s-1040",
    scenario: "Cold Call",
    persona: "VP Operations",
    when: "Yesterday · 9:02 AM",
    duration: "6:10",
    score: 71,
    trend: "-3",
  },
  {
    id: "s-1039",
    scenario: "Objection Handling",
    persona: "CFO",
    when: "Mon · 4:47 PM",
    duration: "12:05",
    score: 78,
    trend: "+2",
  },
];

const metrics = [
  { label: "Sessions this week", value: "7", trend: "+2 vs last" },
  { label: "Avg. score", value: "79", trend: "+4 vs last" },
  { label: "Talk ratio", value: "48%", trend: "On target" },
  { label: "Discovery depth", value: "3.2", trend: "+0.4" },
];

const insights = [
  {
    tag: "Pattern",
    title: "You answer objections before acknowledging them",
    body: "In 4 of your last 5 sessions, you responded within 1.5s of a pricing objection. Try a brief acknowledgment first — it builds trust and buys thinking time.",
  },
  {
    tag: "Win",
    title: "Open-ended questions are up 22%",
    body: "Your discovery calls included more 'how' and 'what' questions this week. Keep leaning on this — your Director persona is opening up more.",
  },
];

export default function DashboardPage() {
  return (
    <>
      <AppNav />
      <main className="flex-1 py-10">
        <Container className="space-y-10">
          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">
                Welcome back
              </div>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Ready for a rep?
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button href="/scenarios" variant="secondary">
                Browse scenarios
              </Button>
              <Button href="/session">Start new session</Button>
            </div>
          </div>

          {/* Start new session — hero card */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 hero-gradient opacity-60 pointer-events-none" />
            <div className="relative grid md:grid-cols-[1.3fr_1fr] gap-6 p-6 sm:p-8">
              <div>
                <Badge tone="brand">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  Start new session
                </Badge>
                <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">
                  Pick up where you left off — or try something harder.
                </h2>
                <p className="mt-3 text-muted-foreground max-w-lg">
                  Jump back into a Discovery Call with your Director persona,
                  or step up to an advanced Closing Conversation.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button href="/session?scenario=discovery-call" size="lg">
                    Resume: Discovery Call
                  </Button>
                  <Button
                    href="/scenarios"
                    size="lg"
                    variant="secondary"
                  >
                    Change scenario
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="bg-surface border border-border rounded-xl p-4"
                  >
                    <div className="text-xs text-muted-foreground">
                      {m.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">
                      {m.value}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {m.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Scenarios */}
          <section>
            <SectionHeader
              title="Scenarios"
              description="Drills built around realistic buyer personas."
              href="/scenarios"
              cta="All scenarios"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {scenarios.map((s) => (
                <ScenarioCard key={s.id} scenario={s} />
              ))}
            </div>
          </section>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
            {/* Recent sessions */}
            <section>
              <SectionHeader
                title="Recent Sessions"
                description="Your last few reps."
                href="#"
                cta="View all"
              />
              <Card>
                <ul className="divide-y divide-border">
                  {recentSessions.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <div className="h-10 w-10 rounded-full bg-brand-soft text-brand flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 12h4l3-7 4 14 3-7h2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {s.scenario}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {s.persona} · {s.when} · {s.duration}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-semibold tabular-nums">
                            {s.score}
                          </div>
                          <div
                            className={`text-[11px] tabular-nums ${
                              s.trend.startsWith("+")
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {s.trend}
                          </div>
                        </div>
                        <Link
                          href="#"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Review
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

            {/* Performance */}
            <section>
              <SectionHeader
                title="Performance"
                description="Last 7 sessions."
              />
              <Card>
                <CardHeader>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Avg. score
                      </div>
                      <div className="mt-1 text-3xl font-semibold tabular-nums">
                        79
                      </div>
                    </div>
                    <Badge tone="success">+4 vs last week</Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <PerformanceChart />
                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                    <Stat label="Opening" value="82" />
                    <Stat label="Discovery" value="76" />
                    <Stat label="Close" value="71" />
                  </div>
                </CardBody>
              </Card>
            </section>
          </div>

          {/* Playbook */}
          <section>
            <SectionHeader
              title="Your Playbook"
              description="The objections and ideal responses you want to practice."
              href="/playbook"
              cta="Manage playbook"
            />
            <PlaybookPreview />
          </section>

          {/* Coaching insights */}
          <section>
            <SectionHeader
              title="Coaching Insights"
              description="Patterns we saw across your recent sessions."
            />
            <div className="grid md:grid-cols-2 gap-5">
              {insights.map((i) => (
                <Card key={i.title} className="p-6">
                  <Badge
                    tone={i.tag === "Win" ? "success" : "brand"}
                    className="mb-3"
                  >
                    {i.tag}
                  </Badge>
                  <h3 className="text-[17px] font-semibold tracking-tight">
                    {i.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {i.body}
                  </p>
                  <CardFooter className="mt-6 -mx-6 -mb-6 px-6">
                    <span className="text-xs text-muted-foreground">
                      Generated after session #1041
                    </span>
                    <Link
                      href="#"
                      className="text-sm text-foreground hover:underline"
                    >
                      See details →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}

function SectionHeader({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        ) : null}
      </div>
      {href && cta ? (
        <Link
          href={href}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {cta} →
        </Link>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted border border-border rounded-lg p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-base font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function PerformanceChart() {
  const points = [62, 68, 65, 74, 71, 82, 79];
  const max = Math.max(...points);
  const min = Math.min(...points) - 5;
  const w = 320;
  const h = 80;
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${d} L${w} ${h} L0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-20"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="perfFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#perfFill)" />
      <path
        d={d}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
