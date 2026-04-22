"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PlaybookEntryCard } from "@/components/playbook-entry";
import { usePlaybook } from "@/hooks/use-playbook";
import {
  PLAYBOOK_CATEGORIES,
  createEntry,
  type PlaybookCategory,
  type PlaybookEntry,
} from "@/lib/playbook";

type Filter = "All" | PlaybookCategory;

const filters: Filter[] = ["All", ...PLAYBOOK_CATEGORIES];

export function PlaybookView() {
  const {
    entries,
    hydrated,
    addEntry,
    updateEntry,
    removeEntry,
    moveEntry,
    loadSamples,
  } = usePlaybook();

  const [filter, setFilter] = useState<Filter>("All");
  const [draft, setDraft] = useState<PlaybookEntry | null>(null);

  const visible = useMemo(() => {
    if (filter === "All") return entries;
    return entries.filter((e) => e.category === filter);
  }, [entries, filter]);

  const handleAddNew = () => {
    if (draft) return;
    setDraft(createEntry());
    setFilter("All");
    queueMicrotask(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const cancelDraft = () => setDraft(null);

  const saveDraft = (patch: Partial<PlaybookEntry>) => {
    addEntry(patch);
    setDraft(null);
  };

  return (
    <main className="flex-1 py-10">
      <Container className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-2xl">
            <Badge tone="brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Your Playbook
            </Badge>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
              Your objections. Your ideal responses.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Capture the pushback you actually hear in the field. Write the
              response you wish you&rsquo;d given last time. Then rehearse it
              until it&rsquo;s yours.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {entries.length > 0 ? (
              <span className="text-sm text-muted-foreground">
                {entries.length}{" "}
                {entries.length === 1 ? "entry" : "entries"}
              </span>
            ) : null}
            <Button onClick={handleAddNew} disabled={!!draft}>
              <PlusIcon /> Add objection
            </Button>
          </div>
        </header>

        {entries.length > 0 ? (
          <FilterBar filter={filter} setFilter={setFilter} />
        ) : null}

        {draft ? (
          <PlaybookEntryCard
            entry={draft}
            startInEdit
            canMoveUp={false}
            canMoveDown={false}
            onSave={saveDraft}
            onDelete={cancelDraft}
            onMove={() => {}}
            onCancelNew={cancelDraft}
          />
        ) : null}

        {!hydrated ? (
          <LoadingSkeleton />
        ) : entries.length === 0 && !draft ? (
          <EmptyState onAdd={handleAddNew} onLoadSamples={loadSamples} />
        ) : (
          <div className="grid gap-4">
            {visible.map((entry) => {
              const globalIndex = entries.findIndex((e) => e.id === entry.id);
              return (
                <PlaybookEntryCard
                  key={entry.id}
                  entry={entry}
                  canMoveUp={globalIndex > 0}
                  canMoveDown={globalIndex < entries.length - 1}
                  onSave={(patch) => updateEntry(entry.id, patch)}
                  onDelete={() => removeEntry(entry.id)}
                  onMove={(dir) => moveEntry(entry.id, dir)}
                />
              );
            })}
            {entries.length > 0 && visible.length === 0 ? (
              <Card className="p-10 text-center text-muted-foreground">
                No entries in{" "}
                <span className="text-foreground">{filter}</span> yet.{" "}
                <button
                  type="button"
                  className="text-foreground underline"
                  onClick={() => setFilter("All")}
                >
                  Clear filter
                </button>
              </Card>
            ) : null}
          </div>
        )}

        {hydrated && entries.length > 0 ? <FooterTips /> : null}
      </Container>
    </main>
  );
}

function FilterBar({
  filter,
  setFilter,
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {filters.map((f) => {
        const active = f === filter;
        return (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`h-8 px-3 rounded-full text-sm border transition-colors ${
              active
                ? "bg-foreground text-background border-foreground"
                : "bg-surface text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({
  onAdd,
  onLoadSamples,
}: {
  onAdd: () => void;
  onLoadSamples: () => void;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-60 pointer-events-none" />
      <div className="relative p-10 sm:p-14 text-center flex flex-col items-center">
        <div className="h-14 w-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-brand mb-5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              d="M6 4h9l4 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M14 4v5h5M9 14h6M9 18h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Build your playbook.
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          The objections you write here become drills in your next session.
          Start with one you heard this week — and write the answer you wish
          you&rsquo;d given.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <Button size="lg" onClick={onAdd}>
            <PlusIcon /> Add your first objection
          </Button>
          <Button size="lg" variant="secondary" onClick={onLoadSamples}>
            Load sample objections
          </Button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Saved to your browser. You can export or sync it later.
        </p>
      </div>
    </Card>
  );
}

function FooterTips() {
  return (
    <Card className="p-6 grid md:grid-cols-3 gap-6">
      <Tip
        title="Write what you actually hear"
        body="Paraphrasing kills the drill. Copy the prospect's exact words if you can — the more specific, the better the rehearsal."
      />
      <Tip
        title="Draft the response, don't perfect it"
        body="The point is to have something to practice out loud. You'll revise it after you hear yourself say it in a session."
      />
      <Tip
        title="Review before calls"
        body="Skim your playbook for five minutes before a real conversation. Patterns you've rehearsed show up automatically."
      />
    </Card>
  );
}

function Tip({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-[13px] font-semibold">{title}</div>
      <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4">
      {[0, 1, 2].map((i) => (
        <Card key={i} className="p-6 animate-pulse">
          <div className="h-5 w-20 rounded-full bg-muted mb-5" />
          <div className="h-5 w-3/4 rounded bg-muted mb-3" />
          <div className="h-24 rounded-xl bg-muted" />
        </Card>
      ))}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
