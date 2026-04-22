import { AppNav } from "@/components/app-nav";
import { BillingModelBuilder } from "@/components/billing-model-builder";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

export default function BillingPage() {
  return (
    <>
      <AppNav />
      <main className="flex-1 py-10">
        <Container className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge tone="brand">Billing</Badge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                Model platform pricing without hiding compute
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
                Shape RolePlay around a monthly member fee, a transparent
                compute layer, and a flexible AI strategy that supports bring
                your own provider, RolePlay-managed resale, or a hybrid of both.
              </p>
            </div>
            <div className="max-w-md rounded-2xl border border-border bg-surface px-5 py-4 text-sm text-muted-foreground">
              The goal is simple: clients should always understand what they are
              paying you for, and what they are paying the models for.
            </div>
          </div>

          <BillingModelBuilder />
        </Container>
      </main>
    </>
  );
}
