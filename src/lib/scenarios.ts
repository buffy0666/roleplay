export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Scenario = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration: string;
  persona: string;
  tags: string[];
};

export const scenarios: Scenario[] = [
  {
    id: "cold-call",
    title: "Cold Call",
    description:
      "Open strong with a skeptical prospect you've never spoken to. Earn 30 seconds, then earn the meeting.",
    difficulty: "Beginner",
    duration: "5–8 min",
    persona: "VP of Operations · mid-market SaaS",
    tags: ["Outbound", "Opener"],
  },
  {
    id: "discovery-call",
    title: "Discovery Call",
    description:
      "Run a structured discovery with an engaged buyer. Uncover pain, budget, and decision process without leading.",
    difficulty: "Intermediate",
    duration: "15–20 min",
    persona: "Director of RevOps · Series C startup",
    tags: ["Qualification", "MEDDIC"],
  },
  {
    id: "objection-handling",
    title: "Objection Handling",
    description:
      "Navigate price pushback, competitor comparisons, and stall tactics without getting defensive.",
    difficulty: "Advanced",
    duration: "10–15 min",
    persona: "CFO · enterprise buyer",
    tags: ["Objections", "Pricing"],
  },
  {
    id: "closing-conversation",
    title: "Closing Conversation",
    description:
      "Drive toward signature. Align on value, resolve the last blockers, and ask for the business.",
    difficulty: "Advanced",
    duration: "20–25 min",
    persona: "Champion + Economic Buyer",
    tags: ["Close", "Multithreading"],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
