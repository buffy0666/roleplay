export type PlaybookCategory =
  | "Price"
  | "Competition"
  | "Timing"
  | "Authority"
  | "Stall"
  | "Trust"
  | "Other";

export const PLAYBOOK_CATEGORIES: PlaybookCategory[] = [
  "Price",
  "Competition",
  "Timing",
  "Authority",
  "Stall",
  "Trust",
  "Other",
];

export type PlaybookEntry = {
  id: string;
  category: PlaybookCategory;
  objection: string;
  disrupter?: string;
  continuedObjection?: string;
  response?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export const PLAYBOOK_STORAGE_KEY = "roleplay.playbook.v1";

export const DISRUPTER_PRESETS: readonly string[] = [
  "What makes you say that?",
  "Could you unpack that for me?",
  "I understand — what led you to that policy?",
  "Could you share a little more about that?",
];

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEntry(partial: Partial<PlaybookEntry> = {}): PlaybookEntry {
  const now = Date.now();
  return {
    id: generateId(),
    category: "Other",
    objection: "",
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

export function hasAnyContent(e: Pick<
  PlaybookEntry,
  "objection" | "disrupter" | "continuedObjection" | "response" | "notes"
>): boolean {
  return Boolean(
    (e.objection && e.objection.trim()) ||
      (e.disrupter && e.disrupter.trim()) ||
      (e.continuedObjection && e.continuedObjection.trim()) ||
      (e.response && e.response.trim()) ||
      (e.notes && e.notes.trim()),
  );
}

export const SAMPLE_PLAYBOOK: Omit<
  PlaybookEntry,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    category: "Price",
    objection: "Your price is higher than the other tools we're looking at.",
    disrupter: "What makes you say that?",
    continuedObjection:
      "Tool X quoted us about 30% less for what looks like the same feature set.",
    response:
      "Got it — fair comparison on paper. Where we usually differ is in [specific capability]. Can I ask: is that capability critical for your team? If it isn't, we may not be the right fit, and I'd rather save us both time than win on sticker.",
    notes:
      "Reframe from cost to value. Don't discount in the first 10 seconds — uncover what's actually being compared.",
  },
  {
    category: "Competition",
    objection: "We're already using a competitor and it's fine.",
    disrupter: "Could you unpack that for me — where does 'fine' stop being enough?",
    continuedObjection:
      "Honestly, the reporting is weak and we end up pulling half of it manually in spreadsheets.",
    response:
      "That's exactly the gap we've focused on. If I showed you how our customers pull the same reporting in two clicks, would that be worth 15 minutes together next week?",
    notes:
      "Lead with curiosity. Get them to name the pain before you pitch anything.",
  },
  {
    category: "Stall",
    objection: "Just send me some info and I'll review it with my team.",
    disrupter: "Could you share a little more about what you'd want to see?",
    continuedObjection:
      "Something high-level on pricing plus a couple of case studies in our space.",
    response:
      "Happy to put that together. Quick question so this lands well — who else is reviewing it with you, and when do you actually need to make a decision? I'll shape the doc around that.",
    notes: "Avoid the 'send info' black hole. Make the next step concrete.",
  },
  {
    category: "Authority",
    objection: "I'd need to get my CFO involved before anything like this.",
    disrupter: "I understand — what led you to that policy?",
    continuedObjection:
      "Any spend over $25K has to go through her office for sign-off.",
    response:
      "That makes sense. What tends to matter most to her on projects like this? I'd rather prep for her questions than walk you into a cold meeting.",
    notes:
      "Treat the CFO as a teammate to be briefed, not a blocker to route around.",
  },
];
