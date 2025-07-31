import { createFileRoute } from "@tanstack/react-router";
import { StockDDMCalculator } from "../components/StockDDMCalculator";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/ddmcalc")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SignedIn>
        <StockDDMCalculator />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
