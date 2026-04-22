import { Suspense } from "react";
import { SessionScreen } from "@/components/session-screen";
import { AppNav } from "@/components/app-nav";

export default function SessionPage() {
  return (
    <>
      <AppNav />
      <Suspense fallback={null}>
        <SessionScreen />
      </Suspense>
    </>
  );
}
