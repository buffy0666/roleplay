import { AppNav } from "@/components/app-nav";
import { PlaybookView } from "@/components/playbook-view";

export const metadata = {
  title: "Playbook — RolePlay",
  description:
    "Capture the objections you hear and the responses you want to practice.",
};

export default function PlaybookPage() {
  return (
    <>
      <AppNav />
      <PlaybookView />
    </>
  );
}
