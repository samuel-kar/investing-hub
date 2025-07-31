import { Link } from "@tanstack/react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export const Navbar = () => (
  <nav className="bg-white shadow sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        <Link to="/" className="hover:underline flex items-center gap-2">
          <span className="hidden sm:inline">Dividend Hub</span>

          <img
            src="/icon.png"
            alt="Logo"
            className="w-13 h-13 p-1 mr-7 bg-gray-100 rounded-full sm:hidden"
          />
        </Link>
      </h1>

      <ul className="flex gap-4 text-sm text-blue-600 font-bold">
        <Link to="/dividendinvesting" className="hover:underline">
          Dividend Guide
        </Link>

        <Link to="/ddmcalc" className="hover:underline">
          DDM Calculator
        </Link>

        <Link to="/ddm-history" className="hover:underline">
          Saved results
        </Link>
        <Link to="/about" className="hover:underline">
          About
        </Link>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-blue-600 hover:underline">Log in</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </ul>
    </div>
  </nav>
);
