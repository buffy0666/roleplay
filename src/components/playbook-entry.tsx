"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DISRUPTER_PRESETS,
  PLAYBOOK_CATEGORIES,
  hasAnyContent,
  type PlaybookCategory,
  type PlaybookEntry,
} from "@/lib/playbook";

type Props = {
  entry: PlaybookEntry;
  startInEdit?: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSave: (patch: Partial<PlaybookEntry>) => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
  onCancelNew?: () => void;
};

export function PlaybookEntryCard({
  entry,
  startInEdit = false,
  canMoveUp,
  canMoveDown,
  onSave,
  onDelete,
  onMove,
  onCancelNew,
}: Props) {
  const [editing, setEditing] = useState(startInEdit);
  const [category, setCategory] = useState<PlaybookCategory>(entry.category);
  const [objection, setObjection] = useState(entry.objection);
  const [disrupter, setDisrupter] = useState(entry.disrupter ?? "");
  const [continuedObjection, setContinuedObjection] = useState(
    entry.continuedObjection ?? "",
  );
  const [response, setResponse] = useState(entry.response ?? "");
  const [notes, setNotes] = useState(entry.notes ?? "");
  const [showDisrupterFlow, setShowDisrupterFlow] = useState(
    Boolean(entry.disrupter || entry.continuedObjection),
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  const objectionRef = useRef<HTMLTextAreaElement | null>(null);
  const disrupterRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) {
      objectionRef.current?.focus();
    }
  }, [editing]);

  const canSave = objection.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const useFlow = showDisrupterFlow;
    onSave({
      category,
      objection: objection.trim(),
      disrupter: useFlow && disrupter.trim() ? disrupter.trim() : undefined,
      continuedObjection:
        useFlow && continuedObjection.trim()
          ? continuedObjection.trim()
          : undefined,
      response: response.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    const isDraft = !hasAnyContent(entry);
    if (isDraft && onCancelNew) {
      onCancelNew();
      return;
    }
    setCategory(entry.category);
    setObjection(entry.objection);
    setDisrupter(entry.disrupter ?? "");
    setContinuedObjection(entry.continuedObjection ?? "");
    setResponse(entry.response ?? "");
    setNotes(entry.notes ?? "");
    setShowDisrupterFlow(
      Boolean(entry.disrupter || entry.continuedObjection),
    );
    setEditing(false);
  };

  const openDisrupterFlow = () => {
    setShowDisrupterFlow(true);
    requestAnimationFrame(() => disrupterRef.current?.focus());
  };

  const removeDisrupterFlow = () => {
    setDisrupter("");
    setContinuedObjection("");
    setShowDisrupterFlow(false);
  };

  if (editing) {
    return (
      <Card className="p-6 border-foreground/15 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between mb-5">
          <Badge tone="brand">
            {hasAnyContent(entry) ? "Editing" : "New objection"}
          </Badge>
          <div className="text-xs text-muted-foreground">
            Only the objection is required. Add the rest as you draft it.
          </div>
        </div>

        <div className="grid gap-5">
          <Field label="Category">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as PlaybookCategory)}
            >
              {PLAYBOOK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Objection" hint="What the prospect actually says">
            <Textarea
              ref={objectionRef}
              value={objection}
              onChange={(e) => setObjection(e.target.value)}
              placeholder="e.g. Your price is higher than the other tools we're looking at."
              rows={2}
            />
          </Field>

          {showDisrupterFlow ? (
            <DisrupterSection
              disrupter={disrupter}
              onChangeDisrupter={setDisrupter}
              continuedObjection={continuedObjection}
              onChangeContinuedObjection={setContinuedObjection}
              onRemove={removeDisrupterFlow}
              inputRef={disrupterRef}
            />
          ) : (
            <AddDisrupterButton onClick={openDisrupterFlow} />
          )}

          <Field
            label="Response"
            hint="Optional — the answer you want to practice"
          >
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="e.g. Got it — fair question. Where we usually differ is on…"
              rows={4}
            />
          </Field>

          <Field label="Notes" hint="Optional — cues for yourself">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tone, body language, the trap to avoid…"
              rows={2}
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Saved to this browser. Your data stays local for now.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              Save
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <Badge tone="neutral">{entry.category}</Badge>
        <div className="flex items-center gap-1">
          <IconButton
            label="Move up"
            disabled={!canMoveUp}
            onClick={() => onMove(-1)}
          >
            <ArrowIcon direction="up" />
          </IconButton>
          <IconButton
            label="Move down"
            disabled={!canMoveDown}
            onClick={() => onMove(1)}
          >
            <ArrowIcon direction="down" />
          </IconButton>
          <IconButton label="Edit" onClick={() => setEditing(true)}>
            <EditIcon />
          </IconButton>
          <IconButton
            label="Delete"
            onClick={() => setConfirmDelete(true)}
            tone="danger"
          >
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      <StepList>
        <Step
          label="Objection"
          kind="objection"
          content={
            <p className="text-[17px] leading-7 font-medium">
              &ldquo;{entry.objection}&rdquo;
            </p>
          }
        />

        {entry.disrupter ? (
          <Step
            label="Your disrupter"
            kind="disrupter"
            content={
              <div className="rounded-xl border border-brand/20 bg-brand-soft/70 p-3.5">
                <p className="text-[14px] leading-6 text-foreground">
                  &ldquo;{entry.disrupter}&rdquo;
                </p>
              </div>
            }
          />
        ) : null}

        {entry.continuedObjection ? (
          <Step
            label="Likely continued objection"
            kind="continued"
            content={
              <p className="text-[14px] leading-6 text-muted-foreground italic">
                &ldquo;{entry.continuedObjection}&rdquo;
              </p>
            }
          />
        ) : null}

        {entry.response ? (
          <Step
            label="Your response"
            kind="response"
            content={
              <div className="rounded-xl border border-border bg-muted/50 p-3.5">
                <p className="text-[14px] leading-7 text-foreground">
                  {entry.response}
                </p>
              </div>
            }
          />
        ) : null}
      </StepList>

      {!entry.disrupter && !entry.response ? (
        <div className="mt-4 rounded-lg border border-dashed border-border p-3 text-[13px] text-muted-foreground">
          You haven&rsquo;t drafted a disrupter or response yet.{" "}
          <button
            type="button"
            className="text-foreground underline"
            onClick={() => setEditing(true)}
          >
            Fill it in
          </button>{" "}
          so you can practice it.
        </div>
      ) : null}

      {entry.notes ? (
        <div className="mt-5">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
            Notes
          </div>
          <p className="text-[13px] leading-6 text-muted-foreground">
            {entry.notes}
          </p>
        </div>
      ) : null}

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Updated {formatRelative(entry.updatedAt)}
        </span>
        <Link
          href={`/session?objection=${entry.id}`}
          className="text-sm font-medium text-foreground hover:underline"
        >
          Practice this →
        </Link>
      </div>

      {confirmDelete ? (
        <div className="mt-4 p-3 rounded-lg border border-red-500/30 bg-red-500/5 flex items-center justify-between gap-3">
          <span className="text-sm text-foreground">
            Delete this objection?
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

// ─── Edit helpers ──────────────────────────────────────────────────────────

function AddDisrupterButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-4 flex items-center justify-between gap-4">
      <div>
        <div className="text-[13px] font-semibold">Add a disrupter</div>
        <p className="text-[12px] leading-5 text-muted-foreground mt-0.5 max-w-sm">
          Unpack the objection before you answer. A disrupter buys you room and
          surfaces what&rsquo;s actually behind the pushback.
        </p>
      </div>
      <Button size="sm" variant="secondary" onClick={onClick}>
        + Add disrupter
      </Button>
    </div>
  );
}

function DisrupterSection({
  disrupter,
  onChangeDisrupter,
  continuedObjection,
  onChangeContinuedObjection,
  onRemove,
  inputRef,
}: {
  disrupter: string;
  onChangeDisrupter: (v: string) => void;
  continuedObjection: string;
  onChangeContinuedObjection: (v: string) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="rounded-xl border border-brand/25 bg-brand-soft/40 p-4 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-brand">
          Disrupter flow
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Remove
        </button>
      </div>

      <Field label="Disrupter" hint="Say this first — don't answer yet">
        <input
          ref={inputRef}
          type="text"
          value={disrupter}
          onChange={(e) => onChangeDisrupter(e.target.value)}
          placeholder="Pick a preset below or type your own"
          className="w-full h-10 px-3.5 rounded-lg bg-surface border border-border text-[14px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-brand/20"
        />
      </Field>

      <div className="flex flex-wrap gap-1.5">
        {DISRUPTER_PRESETS.map((p) => {
          const active = disrupter.trim() === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChangeDisrupter(p)}
              className={`h-7 px-2.5 text-[12px] rounded-full border transition-colors ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "bg-surface text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <Field
        label="Likely continued objection"
        hint="Optional — what they'll probably say next"
      >
        <Textarea
          value={continuedObjection}
          onChange={(e) => onChangeContinuedObjection(e.target.value)}
          placeholder="e.g. Tool X quoted us 30% less for the same features."
          rows={2}
        />
      </Field>
    </div>
  );
}

// ─── View helpers ──────────────────────────────────────────────────────────

type StepKind = "objection" | "disrupter" | "continued" | "response";

function StepList({ children }: { children: React.ReactNode }) {
  return <ol className="relative space-y-5">{children}</ol>;
}

function Step({
  label,
  kind,
  content,
}: {
  label: string;
  kind: StepKind;
  content: React.ReactNode;
}) {
  const dot =
    kind === "disrupter"
      ? "bg-brand"
      : kind === "response"
        ? "bg-foreground"
        : "bg-muted-foreground/60";
  return (
    <li className="relative pl-6">
      <span
        className={`absolute left-0 top-2 h-2.5 w-2.5 rounded-full ${dot}`}
        aria-hidden="true"
      />
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
        {label}
      </div>
      {content}
    </li>
  );
}

// ─── Icon buttons ──────────────────────────────────────────────────────────

function IconButton({
  label,
  disabled,
  onClick,
  tone = "default",
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  tone?: "default" | "danger";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "danger"
      ? "hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
      : "hover:bg-muted hover:text-foreground";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none ${toneClass}`}
    >
      {children}
    </button>
  );
}

function ArrowIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-4 w-4 ${direction === "down" ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="m6 15 6-6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 20h4L20 8l-4-4L4 16v4ZM14 6l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.round(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
