"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

export function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-[#ACAEA1] hover:text-white transition-colors min-[551px]:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span className="text-xl leading-none" aria-hidden>
          {open ? "✕" : "☰"}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-[#546B4C]/30 bg-[#071205] px-4 pb-4 pt-2 min-[551px]:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/companies"
              onClick={() => setOpen(false)}
              className="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-[#ACAEA1] hover:bg-[#ACAEA1]/10 hover:text-white transition-colors"
            >
              Vendors
            </Link>
            <Link
              href="/reviews"
              onClick={() => setOpen(false)}
              className="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-[#ACAEA1] hover:bg-[#ACAEA1]/10 hover:text-white transition-colors"
            >
              Reviews
            </Link>
            <Link
              href="/dashboard-protected-routes"
              onClick={() => setOpen(false)}
              className="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-[#ACAEA1] hover:bg-[#ACAEA1]/10 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <div className="mt-2 px-3">
              <Link
                href={isLoggedIn ? "/dashboard-protected-routes/profile" : "/login"}
                onClick={() => setOpen(false)}
              >
                <Button variant="accent" size="sm" className="w-full justify-center">
                  {isLoggedIn ? "Account" : "Sign in"}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
