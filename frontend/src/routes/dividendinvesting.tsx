import { createFileRoute } from "@tanstack/react-router";
import DividendPropaganda from "../components/DividendPropaganda";

export const Route = createFileRoute("/dividendinvesting")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DividendPropaganda />
    </div>
  );
}
