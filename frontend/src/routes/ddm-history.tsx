import { createFileRoute } from "@tanstack/react-router";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { DdmHistoryTable } from "../components/DdmHistoryTable";

export const Route = createFileRoute("/ddm-history")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SignedIn>
        <DdmHistoryTable />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
