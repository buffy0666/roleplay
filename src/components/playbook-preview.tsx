"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePlaybook } from "@/hooks/use-playbook";

export function PlaybookPreview() {
  const { entries, hydrated } = usePlaybook();
  const preview = entries.slice(0, 3);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone="brand">Your Playbook</Badge>
          <h3 className="mt-3 text-[17px] font-semibold tracking-tight">
            Objections you want to master
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Capture real pushback and the response you want to practice.
          </p>
        </div>
        <Button href="/playbook" variant="secondary" size="sm">
          Open playbook
        </Button>
      </div>

      <div className="mt-5">
        {!hydrated ? (
          <div className="space-y-2">
            <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
            <div className="h-4 w-3/5 rounded bg-muted animate-pulse" />
          </div>
        ) : preview.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-5 text-center">
            <p className="text-sm text-muted-foreground">
              You haven&rsquo;t added any objections yet.
            </p>
            <Link
              href="/playbook"
              className="mt-2 inline-block text-sm font-medium text-foreground hover:underline"
            >
              Build your playbook →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border border border-border rounded-xl bg-surface overflow-hidden">
            {preview.map((e) => (
              <li key={e.id} className="px-4 py-3 flex items-start gap-3">
                <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground w-20 shrink-0">
                  {e.category}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">
                    &ldquo;{e.objection}&rdquo;
                  </p>
                  <FlowBar
                    hasDisrupter={!!e.disrupter}
                    hasContinued={!!e.continuedObjection}
                    hasResponse={!!e.response}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hydrated && entries.length > preview.length ? (
        <div className="mt-3 text-xs text-muted-foreground">
          + {entries.length - preview.length} more
        </div>
      ) : null}
    </Card>
  );
}

function FlowBar({
  hasDisrupter,
  hasContinued,
  hasResponse,
}: {
  hasDisrupter: boolean;
  hasContinued: boolean;
  hasResponse: boolean;
}) {
  const steps: { label: string; active: boolean }[] = [
    { label: "Disrupter", active: hasDisrupter },
    { label: "Continued", active: hasContinued },
    { label: "Response", active: hasResponse },
  ];
  return (
    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
      {steps.map((s) => (
        <span
          key={s.label}
          className={`inline-flex items-center gap-1 text-[10px] font-medium ${
            s.active ? "text-foreground" : "text-muted-foreground/70"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              s.active ? "bg-brand" : "bg-muted-foreground/40"
            }`}
          />
          {s.label}
        </span>
      ))}
    </div>
  );
}
