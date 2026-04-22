"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBilling } from "@/hooks/use-billing";
import {
  BILLING_AI_MODES,
  COMPUTE_BILLING_MODES,
  calculateBillingSummary,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/billing";

export function BillingModelBuilder() {
  const { model, hydrated, updateModel, resetModel } = useBilling();
  const summary = useMemo(() => calculateBillingSummary(model), [model]);

  const insights = buildInsights(model.aiMode, model.computeBillingMode, summary.computeBaseCost, model.softUsageBudget);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Platform fee"
          value={formatCurrency(summary.platformMonthlyFee)}
          hint={`${formatNumber(model.activeMembers)} members × ${formatCurrency(model.platformFeePerMember)}`}
        />
        <MetricCard
          label="Compute fee"
          value={
            model.computeBillingMode === "Client Direct"
              ? "Direct to provider"
              : formatCurrency(summary.computeClientPrice)
          }
          hint={
            model.computeBillingMode === "Client Direct"
              ? "Not invoiced through RolePlay"
              : `${model.computeBillingMode} on ${formatCurrency(summary.computeBaseCost)} base cost`
          }
        />
        <MetricCard
          label="Estimated total"
          value={formatCurrency(summary.estimatedInvoiceTotal)}
          hint="Current monthly invoice preview"
        />
        <MetricCard
          label="AI mode"
          value={model.aiMode}
          hint={`Last updated ${new Date(model.updatedAt).toLocaleDateString()}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <Badge tone="brand">Billing Model</Badge>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">
              Platform fee + compute fee, with BYO or resale support
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Configure how RolePlay charges for seats, who owns compute spend,
              and whether AI usage is client-direct, passed through, or resold.
            </p>
          </CardHeader>
          <CardBody className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2">
              <Field label="Active members">
                <Input
                  type="number"
                  min={1}
                  value={model.activeMembers}
                  onChange={(event) =>
                    updateModel({ activeMembers: toNumber(event.target.value, 1) })
                  }
                />
              </Field>
              <Field label="Platform fee per member" hint="USD / month">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={model.platformFeePerMember}
                  onChange={(event) =>
                    updateModel({
                      platformFeePerMember: toNumber(event.target.value, 0),
                    })
                  }
                />
              </Field>
              <Field label="AI mode">
                <Select
                  value={model.aiMode}
                  onChange={(event) =>
                    updateModel({
                      aiMode: event.target.value as (typeof BILLING_AI_MODES)[number],
                    })
                  }
                >
                  {BILLING_AI_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Compute billing mode">
                <Select
                  value={model.computeBillingMode}
                  onChange={(event) =>
                    updateModel({
                      computeBillingMode: event.target.value as (typeof COMPUTE_BILLING_MODES)[number],
                    })
                  }
                >
                  {COMPUTE_BILLING_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Compute markup"
                hint="Used only when compute is resold"
              >
                <Input
                  type="number"
                  min={0}
                  step="1"
                  value={model.computeMarkupPercent}
                  onChange={(event) =>
                    updateModel({
                      computeMarkupPercent: toNumber(event.target.value, 0),
                    })
                  }
                />
              </Field>
              <Field label="Soft monthly compute budget" hint="USD">
                <Input
                  type="number"
                  min={0}
                  step="1"
                  value={model.softUsageBudget}
                  onChange={(event) =>
                    updateModel({ softUsageBudget: toNumber(event.target.value, 0) })
                  }
                />
              </Field>
              <Field label="Low-credit warning threshold" hint="USD remaining">
                <Input
                  type="number"
                  min={0}
                  step="1"
                  value={model.lowCreditThreshold}
                  onChange={(event) =>
                    updateModel({
                      lowCreditThreshold: toNumber(event.target.value, 0),
                    })
                  }
                />
              </Field>
              <Field label="Projected sessions / month">
                <Input
                  type="number"
                  min={0}
                  step="1"
                  value={model.projectedSessionsPerMonth}
                  onChange={(event) =>
                    updateModel({
                      projectedSessionsPerMonth: toNumber(event.target.value, 0),
                    })
                  }
                />
              </Field>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <Field label="Avg. minutes / session">
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  value={model.averageMinutesPerSession}
                  onChange={(event) =>
                    updateModel({
                      averageMinutesPerSession: toNumber(event.target.value, 0),
                    })
                  }
                />
              </Field>
              <Field label="Transcription cost / minute" hint="USD">
                <Input
                  type="number"
                  min={0}
                  step="0.001"
                  value={model.transcriptionCostPerMinute}
                  onChange={(event) =>
                    updateModel({
                      transcriptionCostPerMinute: toNumber(
                        event.target.value,
                        0,
                      ),
                    })
                  }
                />
              </Field>
              <Field label="Voice cost / minute" hint="USD">
                <Input
                  type="number"
                  min={0}
                  step="0.001"
                  value={model.voiceCostPerMinute}
                  onChange={(event) =>
                    updateModel({ voiceCostPerMinute: toNumber(event.target.value, 0) })
                  }
                />
              </Field>
            </section>

            <section className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
              <Field label="AI cost / session" hint="USD">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={model.aiCostPerSession}
                  onChange={(event) =>
                    updateModel({ aiCostPerSession: toNumber(event.target.value, 0) })
                  }
                />
              </Field>
              <Field label="Notes" hint="Saved locally for now">
                <Textarea
                  rows={4}
                  value={model.notes}
                  onChange={(event) => updateModel({ notes: event.target.value })}
                />
              </Field>
            </section>
          </CardBody>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              {hydrated
                ? "Stored locally so you can shape the pricing model without backend work yet."
                : "Hydrating billing model…"}
            </div>
            <Button variant="secondary" size="sm" onClick={resetModel}>
              Reset model
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Badge tone="success">Invoice Preview</Badge>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                Estimated monthly customer billing
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4 text-sm">
                <LineItem
                  label="Platform fee"
                  value={formatCurrency(summary.platformMonthlyFee)}
                  meta={`${formatNumber(model.activeMembers)} members`}
                />
                <LineItem
                  label="Transcription"
                  value={formatCurrency(summary.transcriptionMonthlyCost)}
                  meta={`${formatNumber(summary.monthlyVoiceMinutes)} minutes`}
                />
                <LineItem
                  label="Voice"
                  value={formatCurrency(summary.voiceMonthlyCost)}
                  meta={`${formatNumber(summary.monthlyVoiceMinutes)} minutes`}
                />
                <LineItem
                  label="AI runtime"
                  value={formatCurrency(summary.aiMonthlyCost)}
                  meta={`${formatNumber(model.projectedSessionsPerMonth)} sessions`}
                />
                <div className="border-t border-border pt-4 space-y-3">
                  <LineItem
                    label="Base compute cost"
                    value={formatCurrency(summary.computeBaseCost)}
                    meta={model.computeBillingMode}
                  />
                  <LineItem
                    label="Client-facing compute fee"
                    value={
                      model.computeBillingMode === "Client Direct"
                        ? "Direct"
                        : formatCurrency(summary.computeClientPrice)
                    }
                    meta={
                      model.computeBillingMode === "Resold with Markup"
                        ? `${formatPercent(model.computeMarkupPercent)} markup`
                        : undefined
                    }
                  />
                </div>
                <div className="border-t border-border pt-4 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Estimated invoice total
                    </div>
                    <div className="mt-1 text-2xl font-semibold tracking-tight">
                      {formatCurrency(summary.estimatedInvoiceTotal)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Compute margin
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {model.computeBillingMode === "Client Direct"
                        ? "N/A"
                        : formatCurrency(summary.grossMarginOnCompute)}
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Badge tone="brand">Transparency Rules</Badge>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                What the product should explain to clients
              </h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {insights.map((insight) => (
                  <li
                    key={insight.title}
                    className="rounded-xl border border-border bg-background/40 p-4"
                  >
                    <div className="font-medium text-foreground">{insight.title}</div>
                    <div className="mt-1">{insight.body}</div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{hint}</div>
    </Card>
  );
}

function LineItem({
  label,
  value,
  meta,
}: {
  label: string;
  value: string;
  meta?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="font-medium text-foreground">{label}</div>
        {meta ? <div className="text-xs text-muted-foreground mt-0.5">{meta}</div> : null}
      </div>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  );
}

function buildInsights(
  aiMode: string,
  computeBillingMode: string,
  computeBaseCost: number,
  softUsageBudget: number,
) {
  const insights = [
    {
      title: "Split product value from raw compute",
      body:
        "Keep the monthly member fee framed around RolePlay itself: scenarios, coaching UX, reporting, and workflow value. Compute stays separate so usage spikes do not erode platform pricing.",
    },
    {
      title: `${aiMode} should be visible in billing settings`,
      body:
        aiMode === "Bring Your Own AI"
          ? "When clients bring their own provider, show provider status and credits clearly, but do not imply that compute is part of the platform subscription."
          : aiMode === "RolePlay Managed AI"
            ? "When RolePlay manages the provider, surface compute spend as a separate line item and warn before customers hit low-credit or out-of-credit states."
            : "Hybrid works best when admins can choose between client-managed and RolePlay-managed compute, with clear indicators of which sessions hit which pool.",
    },
    {
      title: `Current compute posture: ${computeBillingMode}`,
      body:
        computeBillingMode === "Client Direct"
          ? "This is the cleanest transparency story. RolePlay bills the platform fee, while the client either pays their provider directly or uses their own AI account."
          : computeBillingMode === "Pass Through"
            ? "Pass-through keeps invoices cleaner for the client, but be explicit that the compute fee mirrors underlying provider cost and is not bundled into the seat price."
            : "Reselling compute can create margin, but it needs tight budget alerts and monthly usage visibility so customers never feel surprised by AI spend.",
    },
  ];

  if (computeBaseCost > softUsageBudget) {
    insights.push({
      title: "Projected usage is over budget",
      body: `The current compute model projects ${formatCurrency(computeBaseCost)} against a soft budget of ${formatCurrency(softUsageBudget)}. Add in-product warnings before sessions start hitting that ceiling.`,
    });
  }

  return insights;
}

function toNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
