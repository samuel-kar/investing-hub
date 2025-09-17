import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/calculators")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SignedIn>
        <div className="max-w-5xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Calculators
            </h1>
            <p className="text-gray-600 mb-6">
              Choose from our collection of financial calculators to help with
              your investment decisions.
            </p>

            {/* Sub-navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <Link
                  to="/calculators/ddm"
                  className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                  activeProps={{
                    className:
                      "py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm",
                  }}
                >
                  DDM Calculator
                </Link>
                <Link
                  to="/calculators/compound-interest"
                  className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                  activeProps={{
                    className:
                      "py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm",
                  }}
                >
                  Compound Interest
                </Link>
                <Link
                  to="/calculators/chowder-rule"
                  className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
                  activeProps={{
                    className:
                      "py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm",
                  }}
                >
                  Chowder Rule
                </Link>
              </nav>
            </div>
          </div>

          {/* Sub-route content */}
          <Outlet />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
