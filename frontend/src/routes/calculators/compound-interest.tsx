import { createFileRoute } from "@tanstack/react-router";
import { CompoundInterestCalculator } from "../../components/CompoundInterestCalculator";

export const Route = createFileRoute("/calculators/compound-interest")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CompoundInterestCalculator />;
}
