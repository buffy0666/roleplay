"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { usePlaybook } from "@/hooks/use-playbook";
import { getScenario, scenarios } from "@/lib/scenarios";

type Turn = {
  id: number;
  speaker: "ai" | "rep";
  text: string;
};

const seededTurns: Turn[] = [
  {
    id: 1,
    speaker: "ai",
    text: "Hi — this is Jordan. I've got about eight minutes before my next thing.",
  },
  {
    id: 2,
    speaker: "rep",
    text: "Thanks for making the time, Jordan. I'll keep it tight. Mind if I ask what prompted you to take this call?",
  },
  {
    id: 3,
    speaker: "ai",
    text: "Honestly, my team's been complaining about how long our current tool takes to set up. I'm curious what you do differently.",
  },
];

type Status = "idle" | "live" | "paused" | "ended";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function SessionScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const scenarioId = params.get("scenario") ?? "discovery-call";
  const objectionId = params.get("objection");
  const scenario = useMemo(
    () => getScenario(scenarioId) ?? scenarios[0],
    [scenarioId],
  );
  const { entries: playbookEntries, hydrated: playbookHydrated } = usePlaybook();
  const focusedObjection = useMemo(
    () => playbookEntries.find((e) => e.id === objectionId) ?? null,
    [playbookEntries, objectionId],
  );

  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  // Timer
  useEffect(() => {
    if (status !== "live") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  // Seed transcript progressively once live
  useEffect(() => {
    if (status !== "live") return;
    if (turns.length >= seededTurns.length) return;
    const next = seededTurns[turns.length];
    const delay = turns.length === 0 ? 600 : 2400;
    const t = setTimeout(() => {
      setTurns((prev) => [...prev, next]);
    }, delay);
    return () => clearTimeout(t);
  }, [status, turns]);

  // Auto-scroll transcript
  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [turns]);

  const handleStart = () => {
    if (status === "ended") {
      setSeconds(0);
      setTurns([]);
    }
    setStatus("live");
  };
  const handleEnd = () => setStatus("ended");

  return (
    <main className="flex-1 py-6">
      <Container className="space-y-5">
        {/* Header */}
        <Card className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-brand to-blue-500 flex items-center justify-center text-white font-semibold">
              J
              {status === "live" ? (
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-surface" />
              ) : null}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-semibold truncate">
                  {scenario.title} · Jordan
                </h1>
                <Badge tone="neutral">{scenario.difficulty}</Badge>
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {scenario.persona}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <TimerPill seconds={seconds} status={status} />
            <StatusPill status={status} />
          </div>
        </Card>

        <div className="grid lg:grid-cols-[1fr_340px] gap-5">
          {/* Transcript */}
          <Card className="flex flex-col min-h-[520px]">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Transcript
              </div>
              <div className="text-xs text-muted-foreground">
                {turns.length} turn{turns.length === 1 ? "" : "s"}
              </div>
            </div>
            <div
              ref={transcriptRef}
              className="flex-1 px-5 py-5 space-y-3 overflow-y-auto max-h-[60vh]"
            >
              {status === "idle" ? (
                <EmptyTranscript />
              ) : (
                <>
                  {turns.map((t) => (
                    <TranscriptLine key={t.id} turn={t} />
                  ))}
                  {status === "live" &&
                  turns.length > 0 &&
                  turns.length < seededTurns.length ? (
                    <TypingLine speaker="ai" />
                  ) : null}
                  {status === "ended" ? (
                    <div className="text-center text-xs text-muted-foreground pt-4">
                      — End of call —
                    </div>
                  ) : null}
                </>
              )}
            </div>

            {/* Controls */}
            <div className="border-t border-border px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/scenarios")}
                >
                  ← Scenarios
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {status !== "live" ? (
                  <Button onClick={handleStart} size="md">
                    <Icon name="phone" /> {status === "ended" ? "Restart" : "Start"}
                  </Button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setMuted((m) => !m)}
                      className={`inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm transition-colors ${
                        muted
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                          : "bg-surface border-border text-foreground hover:border-foreground/30"
                      }`}
                    >
                      <Icon name={muted ? "mic-off" : "mic"} />
                      {muted ? "Unmute" : "Mute"}
                    </button>
                    <Button variant="danger" onClick={handleEnd}>
                      <Icon name="phone-off" /> End call
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* AI prospect panel */}
          <div className="space-y-5">
            <Card className="p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                AI Prospect
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-brand to-blue-500 flex items-center justify-center text-white font-semibold">
                  J
                </div>
                <div>
                  <div className="text-sm font-semibold">Jordan Ellis</div>
                  <div className="text-xs text-muted-foreground">
                    {scenario.persona}
                  </div>
                </div>
              </div>

              <VoiceViz active={status === "live" && !muted} />

              <dl className="mt-5 space-y-3 text-sm">
                <InfoRow label="Goals">
                  Reduce onboarding time. Skeptical of switching costs.
                </InfoRow>
                <InfoRow label="Temperament">
                  Direct, time-conscious, willing to engage if value is clear.
                </InfoRow>
                <InfoRow label="Known objections">
                  Price, implementation risk, internal buy-in.
                </InfoRow>
              </dl>
            </Card>

            <PlaybookPanel
              entries={playbookEntries}
              hydrated={playbookHydrated}
              focused={focusedObjection}
            />

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Live Signals
                </div>
                <Badge tone={status === "live" ? "success" : "neutral"}>
                  {status === "live" ? "Recording" : "Idle"}
                </Badge>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                <Signal label="Talk ratio" value="52%" tone="success" />
                <Signal label="Pacing" value="138 wpm" tone="success" />
                <Signal
                  label="Filler words"
                  value="4"
                  tone="warning"
                />
                <Signal label="Questions asked" value="3" tone="success" />
              </ul>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}

function TimerPill({ seconds, status }: { seconds: number; status: Status }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        Timer
      </div>
      <div
        className={`font-mono tabular-nums text-lg font-semibold ${
          status === "live" ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {formatTime(seconds)}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  if (status === "idle") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
        Not started
      </span>
    );
  }
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <span className="h-2 w-2 rounded-full bg-red-500" />
      Ended
    </span>
  );
}

function EmptyTranscript() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-16">
      <div className="h-12 w-12 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
        <Icon name="phone" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold">Ready when you are</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Your AI prospect is on the other end. Hit Start to begin the call.
        Transcript appears here in real time.
      </p>
    </div>
  );
}

function TranscriptLine({ turn }: { turn: Turn }) {
  const isRep = turn.speaker === "rep";
  return (
    <div className={`flex ${isRep ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
          isRep
            ? "bg-foreground text-background"
            : "bg-muted text-foreground border border-border"
        }`}
      >
        <div
          className={`text-[10px] uppercase tracking-wide mb-0.5 ${
            isRep ? "text-background/60" : "text-muted-foreground"
          }`}
        >
          {isRep ? "You" : "AI Prospect"}
        </div>
        {turn.text}
      </div>
    </div>
  );
}

function TypingLine({ speaker }: { speaker: "ai" | "rep" }) {
  const isRep = speaker === "rep";
  return (
    <div className={`flex ${isRep ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-2xl px-4 py-2.5 ${
          isRep
            ? "bg-foreground text-background"
            : "bg-muted text-foreground border border-border"
        }`}
      >
        <div className="flex items-center gap-1 h-5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

function VoiceViz({ active }: { active: boolean }) {
  const bars = [0.4, 0.8, 0.6, 1, 0.7, 0.5, 0.9, 0.6, 0.4];
  return (
    <div className="mt-5 h-16 rounded-xl bg-muted/60 border border-border flex items-end justify-center gap-1 px-4 py-3">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full bg-brand transition-all ${
            active ? "animate-pulse" : "opacity-40"
          }`}
          style={{
            height: `${(active ? h : 0.25) * 100}%`,
            animationDelay: `${i * 80}ms`,
            animationDuration: "900ms",
          }}
        />
      ))}
    </div>
  );
}

function PlaybookPanel({
  entries,
  hydrated,
  focused,
}: {
  entries: ReturnType<typeof usePlaybook>["entries"];
  hydrated: boolean;
  focused: ReturnType<typeof usePlaybook>["entries"][number] | null;
}) {
  if (!hydrated) {
    return (
      <Card className="p-5">
        <div className="h-4 w-28 rounded bg-muted animate-pulse" />
        <div className="mt-4 h-20 rounded-lg bg-muted animate-pulse" />
      </Card>
    );
  }

  if (focused) {
    return (
      <Card className="p-5 border-brand/30">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wide text-brand">
            From your playbook
          </div>
          <Badge tone="brand">{focused.category}</Badge>
        </div>

        <ol className="mt-4 space-y-4">
          <FocusedStep
            label="Objection"
            tone="muted"
            body={
              <p className="text-[14px] leading-6 font-medium">
                &ldquo;{focused.objection}&rdquo;
              </p>
            }
          />
          {focused.disrupter ? (
            <FocusedStep
              label="Your disrupter"
              tone="brand"
              body={
                <div className="rounded-lg border border-brand/25 bg-brand-soft/60 px-3 py-2">
                  <p className="text-[13px] leading-6">
                    &ldquo;{focused.disrupter}&rdquo;
                  </p>
                </div>
              }
            />
          ) : null}
          {focused.continuedObjection ? (
            <FocusedStep
              label="Likely continued"
              tone="muted"
              body={
                <p className="text-[13px] leading-6 italic text-muted-foreground">
                  &ldquo;{focused.continuedObjection}&rdquo;
                </p>
              }
            />
          ) : null}
          {focused.response ? (
            <FocusedStep
              label="Your response"
              tone="solid"
              body={
                <div className="rounded-lg border border-border bg-muted/60 px-3 py-2">
                  <p className="text-[13px] leading-6">{focused.response}</p>
                </div>
              }
            />
          ) : null}
        </ol>

        {focused.notes ? (
          <p className="mt-4 pt-3 border-t border-border text-[12px] leading-5 text-muted-foreground">
            <span className="uppercase tracking-wide text-[10px] text-muted-foreground/80 mr-1">
              Notes
            </span>
            {focused.notes}
          </p>
        ) : null}

        <div className="mt-4 text-right">
          <Link
            href="/playbook"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Edit in playbook →
          </Link>
        </div>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Your Playbook
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          No custom objections yet. Save the pushback you want to rehearse —
          it shows up here during practice.
        </p>
        <Link
          href="/playbook"
          className="mt-3 inline-block text-sm font-medium text-foreground hover:underline"
        >
          Build your playbook →
        </Link>
      </Card>
    );
  }

  const preview = entries.slice(0, 3);
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          From your playbook
        </div>
        <Link
          href="/playbook"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          All {entries.length} →
        </Link>
      </div>
      <ul className="mt-3 space-y-2">
        {preview.map((e) => (
          <li key={e.id}>
            <Link
              href={`/session?objection=${e.id}`}
              className="block rounded-lg border border-border p-3 hover:border-foreground/20 hover:bg-muted transition-colors"
            >
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {e.category}
              </div>
              <p className="mt-1 text-[13px] leading-5 line-clamp-2">
                &ldquo;{e.objection}&rdquo;
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function FocusedStep({
  label,
  tone,
  body,
}: {
  label: string;
  tone: "muted" | "brand" | "solid";
  body: React.ReactNode;
}) {
  const dot =
    tone === "brand"
      ? "bg-brand"
      : tone === "solid"
        ? "bg-foreground"
        : "bg-muted-foreground/50";
  return (
    <li className="relative pl-5">
      <span
        className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${dot}`}
        aria-hidden="true"
      />
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
        {label}
      </div>
      {body}
    </li>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-foreground">{children}</dd>
    </div>
  );
}

function Signal({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning";
}) {
  const dot = tone === "success" ? "bg-emerald-500" : "bg-amber-500";
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="tabular-nums text-foreground">{value}</span>
    </li>
  );
}

function Icon({ name }: { name: "phone" | "phone-off" | "mic" | "mic-off" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    className: "h-4 w-4",
    "aria-hidden": true as const,
  };
  if (name === "phone") {
    return (
      <svg {...common}>
        <path
          d="M4 5c0-.6.4-1 1-1h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3c0 .6-.4 1-1 1A16 16 0 0 1 4 5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "phone-off") {
    return (
      <svg {...common}>
        <path
          d="M4 5c0-.6.4-1 1-1h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3c0 .6-.4 1-1 1A16 16 0 0 1 4 5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="m3 3 18 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "mic") {
    return (
      <svg {...common}>
        <rect
          x="9"
          y="3"
          width="6"
          height="11"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M5 11a7 7 0 0 0 14 0M12 18v3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M9 9v2a3 3 0 0 0 5 2M15 12V6a3 3 0 0 0-6 0v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 11a7 7 0 0 0 12 5M12 18v3M3 3l18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
