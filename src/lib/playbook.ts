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
  objection: string;
  response: string;
  category: PlaybookCategory;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export const PLAYBOOK_STORAGE_KEY = "roleplay.playbook.v1";

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
    objection: "",
    response: "",
    category: "Other",
    notes: "",
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

export const SAMPLE_PLAYBOOK: Omit<PlaybookEntry, "id" | "createdAt" | "updatedAt">[] = [
  {
    objection: "Your price is higher than the other tools we're looking at.",
    response:
      "Totally fair — price should be in the conversation. Can I ask: if we set price aside for a second, is this the kind of outcome your team actually needs? I want to make sure we're comparing on value, not just sticker.",
    category: "Price",
    notes: "Reframe from cost to outcome. Don't discount in the first 10 seconds.",
  },
  {
    objection: "We're already using a competitor and it's fine.",
    response:
      "That's great to hear — most teams we talk to already have something in place. Out of curiosity, what do you like most about it, and where do you wish it did more? I'll be honest about whether we're a fit or not.",
    category: "Competition",
    notes: "Lead with genuine curiosity. The 'I'll be honest' line builds trust.",
  },
  {
    objection: "Just send me some info and I'll review it with my team.",
    response:
      "Happy to — though if I just send a deck it usually gets buried. What's the one question your team needs answered before this is worth a real conversation? I'll put that on page one.",
    category: "Stall",
    notes: "Avoid the 'send info' black hole. Make the follow-up concrete.",
  },
  {
    objection: "I'd need to get my CFO involved before anything like this.",
    response:
      "That makes sense — this is exactly the kind of decision that should have them in the room. What tends to matter most to your CFO on projects like this? I'd rather prep for their questions than walk in cold.",
    category: "Authority",
    notes: "Don't treat the CFO as a blocker — treat them as a teammate to be briefed.",
  },
];
