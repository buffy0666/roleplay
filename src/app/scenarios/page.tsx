import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { AppNav } from "@/components/app-nav";
import { ScenarioCard } from "@/components/scenario-card";
import { scenarios } from "@/lib/scenarios";

export default function ScenariosPage() {
  return (
    <>
      <AppNav />
      <main className="flex-1 py-10">
        <Container className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="max-w-2xl">
              <Badge tone="brand">Library</Badge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                Scenarios
              </h1>
              <p className="mt-2 text-muted-foreground">
                Drills organized by stage of the funnel. Each runs against a
                distinct AI persona with its own goals and pushback.
              </p>
            </div>
            <FilterBar />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}

            {/* Coming soon placeholder */}
            <div className="border border-dashed border-border rounded-[var(--radius-card)] p-6 flex flex-col items-start justify-between min-h-[260px]">
              <div>
                <Badge>Coming soon</Badge>
                <h3 className="mt-4 text-[17px] font-semibold tracking-tight">
                  Multi-threaded deal
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Navigate a call with a champion and a skeptical economic
                  buyer at the same time. Released next.
                </p>
              </div>
              <button
                type="button"
                className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Notify me →
              </button>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

function FilterBar() {
  const filters = ["All", "Beginner", "Intermediate", "Advanced"];
  return (
    <div className="inline-flex items-center p-1 bg-muted border border-border rounded-full">
      {filters.map((f, i) => (
        <button
          key={f}
          type="button"
          className={`px-3 h-8 text-sm rounded-full transition-colors ${
            i === 0
              ? "bg-surface text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
