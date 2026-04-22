import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import type { Difficulty, Scenario } from "@/lib/scenarios";

const difficultyTone: Record<Difficulty, "success" | "warning" | "danger"> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
};

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <Card interactive className="flex flex-col">
      <CardHeader className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-semibold tracking-tight">
            {scenario.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {scenario.persona}
          </p>
        </div>
        <Badge tone={difficultyTone[scenario.difficulty]}>
          {scenario.difficulty}
        </Badge>
      </CardHeader>
      <CardBody className="flex-1">
        <p className="text-sm leading-6 text-muted-foreground">
          {scenario.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {scenario.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] font-medium text-muted-foreground bg-muted border border-border px-2 h-5 inline-flex items-center rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </CardBody>
      <CardFooter>
        <span className="text-xs text-muted-foreground">
          {scenario.duration}
        </span>
        <Button href={`/session?scenario=${scenario.id}`} size="sm">
          Start
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5"
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
      </CardFooter>
    </Card>
  );
}
