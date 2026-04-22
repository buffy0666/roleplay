"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PLAYBOOK_CATEGORIES,
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
  const [objection, setObjection] = useState(entry.objection);
  const [response, setResponse] = useState(entry.response);
  const [notes, setNotes] = useState(entry.notes ?? "");
  const [category, setCategory] = useState<PlaybookCategory>(entry.category);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const objectionRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editing) {
      objectionRef.current?.focus();
    }
  }, [editing]);

  const canSave = objection.trim().length > 0 && response.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      objection: objection.trim(),
      response: response.trim(),
      notes: notes.trim() || undefined,
      category,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    if (!entry.objection && !entry.response && onCancelNew) {
      onCancelNew();
      return;
    }
    setObjection(entry.objection);
    setResponse(entry.response);
    setNotes(entry.notes ?? "");
    setCategory(entry.category);
    setEditing(false);
  };

  if (editing) {
    return (
      <Card className="p-6 border-foreground/15 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between mb-5">
          <Badge tone="brand">
            {entry.objection ? "Editing" : "New objection"}
          </Badge>
          <div className="text-xs text-muted-foreground">
            Required: objection + ideal response
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

          <Field
            label="Objection"
            hint="What the prospect actually says"
          >
            <Textarea
              ref={objectionRef}
              value={objection}
              onChange={(e) => setObjection(e.target.value)}
              placeholder="e.g. Your price is higher than the other tools we're looking at."
              rows={2}
            />
          </Field>

          <Field
            label="Ideal response"
            hint="The answer you want to practice"
          >
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="e.g. Totally fair — can I ask what's driving that comparison for you?"
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
      <div className="flex items-start justify-between gap-4 mb-4">
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

      <div className="space-y-4">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">
            Objection
          </div>
          <p className="text-[17px] leading-7 font-medium">
            &ldquo;{entry.objection}&rdquo;
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">
            Ideal response
          </div>
          <p className="text-[14px] leading-7 text-foreground">
            {entry.response}
          </p>
        </div>

        {entry.notes ? (
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
              Notes
            </div>
            <p className="text-[13px] leading-6 text-muted-foreground">
              {entry.notes}
            </p>
          </div>
        ) : null}
      </div>

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
