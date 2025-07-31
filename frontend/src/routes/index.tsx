import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="max-w-prose mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Welcome to Dividend Hub
      </h1>
      <p className="mb-4">
        This app is built to help you learn the fundamentals of dividend
        investing and explore how the Dividend Discount Model (DDM) can be used
        to estimate stock value.
      </p>
      <p className="mb-4">
        Use the calculator to try it yourself, or visit the guide to learn more.
      </p>
      <p className="mb-4">
        Remember, this is just one tool — it doesn't always tell the whole
        story. Use your own judgment and combine it with other methods when
        making decisions.
      </p>
    </div>
  );
}
