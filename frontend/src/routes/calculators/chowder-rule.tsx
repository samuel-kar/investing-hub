import { createFileRoute } from "@tanstack/react-router";
import { ChowderRuleCalculator } from "../../components/ChowderRuleCalculator";

export const Route = createFileRoute("/calculators/chowder-rule")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChowderRuleCalculator />;
}
