export type BillingAiMode = "Bring Your Own AI" | "RolePlay Managed AI" | "Hybrid";

export type ComputeBillingMode =
  | "Client Direct"
  | "Pass Through"
  | "Resold with Markup";

export type BillingModel = {
  activeMembers: number;
  platformFeePerMember: number;
  aiMode: BillingAiMode;
  computeBillingMode: ComputeBillingMode;
  computeMarkupPercent: number;
  projectedSessionsPerMonth: number;
  averageMinutesPerSession: number;
  transcriptionCostPerMinute: number;
  voiceCostPerMinute: number;
  aiCostPerSession: number;
  softUsageBudget: number;
  lowCreditThreshold: number;
  notes: string;
  updatedAt: number;
};

export type BillingSummary = {
  platformMonthlyFee: number;
  monthlyVoiceMinutes: number;
  transcriptionMonthlyCost: number;
  voiceMonthlyCost: number;
  aiMonthlyCost: number;
  computeBaseCost: number;
  computeClientPrice: number;
  estimatedInvoiceTotal: number;
  grossMarginOnCompute: number;
};

export const BILLING_STORAGE_KEY = "roleplay.billing-model.v1";

export const BILLING_AI_MODES: BillingAiMode[] = [
  "Bring Your Own AI",
  "RolePlay Managed AI",
  "Hybrid",
];

export const COMPUTE_BILLING_MODES: ComputeBillingMode[] = [
  "Client Direct",
  "Pass Through",
  "Resold with Markup",
];

export const DEFAULT_BILLING_MODEL: BillingModel = {
  activeMembers: 25,
  platformFeePerMember: 79,
  aiMode: "Hybrid",
  computeBillingMode: "Client Direct",
  computeMarkupPercent: 20,
  projectedSessionsPerMonth: 320,
  averageMinutesPerSession: 11,
  transcriptionCostPerMinute: 0.015,
  voiceCostPerMinute: 0.03,
  aiCostPerSession: 0.22,
  softUsageBudget: 400,
  lowCreditThreshold: 100,
  notes:
    "Hybrid keeps enterprise flexibility. Smaller clients can use RolePlay-managed AI; larger clients can bring their own provider.",
  updatedAt: Date.now(),
};

export function sanitizeBillingModel(input: Partial<BillingModel> | null | undefined): BillingModel {
  return {
    ...DEFAULT_BILLING_MODEL,
    ...input,
    activeMembers: sanitizeNumber(input?.activeMembers, DEFAULT_BILLING_MODEL.activeMembers),
    platformFeePerMember: sanitizeNumber(
      input?.platformFeePerMember,
      DEFAULT_BILLING_MODEL.platformFeePerMember,
    ),
    computeMarkupPercent: sanitizeNumber(
      input?.computeMarkupPercent,
      DEFAULT_BILLING_MODEL.computeMarkupPercent,
    ),
    projectedSessionsPerMonth: sanitizeNumber(
      input?.projectedSessionsPerMonth,
      DEFAULT_BILLING_MODEL.projectedSessionsPerMonth,
    ),
    averageMinutesPerSession: sanitizeNumber(
      input?.averageMinutesPerSession,
      DEFAULT_BILLING_MODEL.averageMinutesPerSession,
    ),
    transcriptionCostPerMinute: sanitizeNumber(
      input?.transcriptionCostPerMinute,
      DEFAULT_BILLING_MODEL.transcriptionCostPerMinute,
    ),
    voiceCostPerMinute: sanitizeNumber(
      input?.voiceCostPerMinute,
      DEFAULT_BILLING_MODEL.voiceCostPerMinute,
    ),
    aiCostPerSession: sanitizeNumber(
      input?.aiCostPerSession,
      DEFAULT_BILLING_MODEL.aiCostPerSession,
    ),
    softUsageBudget: sanitizeNumber(
      input?.softUsageBudget,
      DEFAULT_BILLING_MODEL.softUsageBudget,
    ),
    lowCreditThreshold: sanitizeNumber(
      input?.lowCreditThreshold,
      DEFAULT_BILLING_MODEL.lowCreditThreshold,
    ),
    aiMode: BILLING_AI_MODES.includes(input?.aiMode as BillingAiMode)
      ? (input?.aiMode as BillingAiMode)
      : DEFAULT_BILLING_MODEL.aiMode,
    computeBillingMode: COMPUTE_BILLING_MODES.includes(
      input?.computeBillingMode as ComputeBillingMode,
    )
      ? (input?.computeBillingMode as ComputeBillingMode)
      : DEFAULT_BILLING_MODEL.computeBillingMode,
    notes:
      typeof input?.notes === "string"
        ? input.notes
        : DEFAULT_BILLING_MODEL.notes,
    updatedAt: sanitizeNumber(input?.updatedAt, Date.now()),
  };
}

export function calculateBillingSummary(model: BillingModel): BillingSummary {
  const platformMonthlyFee = model.activeMembers * model.platformFeePerMember;
  const monthlyVoiceMinutes = model.projectedSessionsPerMonth * model.averageMinutesPerSession;
  const transcriptionMonthlyCost =
    monthlyVoiceMinutes * model.transcriptionCostPerMinute;
  const voiceMonthlyCost = monthlyVoiceMinutes * model.voiceCostPerMinute;
  const aiMonthlyCost = model.projectedSessionsPerMonth * model.aiCostPerSession;
  const computeBaseCost =
    transcriptionMonthlyCost + voiceMonthlyCost + aiMonthlyCost;

  const computeClientPrice =
    model.computeBillingMode === "Client Direct"
      ? 0
      : model.computeBillingMode === "Pass Through"
        ? computeBaseCost
        : computeBaseCost * (1 + model.computeMarkupPercent / 100);

  return {
    platformMonthlyFee,
    monthlyVoiceMinutes,
    transcriptionMonthlyCost,
    voiceMonthlyCost,
    aiMonthlyCost,
    computeBaseCost,
    computeClientPrice,
    estimatedInvoiceTotal: platformMonthlyFee + computeClientPrice,
    grossMarginOnCompute: computeClientPrice - computeBaseCost,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function sanitizeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
