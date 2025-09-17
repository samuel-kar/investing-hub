import { createFileRoute } from "@tanstack/react-router";
import { StockDDMCalculator } from "../../components/StockDDMCalculator";

export const Route = createFileRoute("/calculators/ddm")({
  component: RouteComponent,
});

function RouteComponent() {
  return <StockDDMCalculator />;
}
