import { createFileRoute } from "@tanstack/react-router";
import AboutText from "../components/AboutText";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <AboutText />
    </div>
  );
}
