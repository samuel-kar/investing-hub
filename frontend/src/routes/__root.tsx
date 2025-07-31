import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navbar } from "../components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Footer } from "../components/Footer";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <div className="text-gray-800 bg-gray-100 min-h-screen flex flex-col">
      <QueryClientProvider client={queryClient}>
        <Navbar />

        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
        <TanStackRouterDevtools />
      </QueryClientProvider>
    </div>
  ),
});
