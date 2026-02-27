"use client";

import { useState } from "react";

export function FilterSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="shrink-0 lg:w-56">
      {/* Mobile: collapsible toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between rounded-xl border border-[#546B4C]/30 bg-[var(--card)] px-4 py-3"
          aria-expanded={open}
        >
          <span className="text-sm font-medium text-[#233620]">Filter by category</span>
          <span
            className="text-[#546B4C] transition-transform duration-200"
            style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-hidden
          >
            ▾
          </span>
        </button>
        {open && (
          <div className="mt-2 rounded-xl border border-[#546B4C]/30 bg-[var(--card)] p-4">
            {children}
          </div>
        )}
      </div>

      {/* Desktop: always-visible sticky sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-[#546B4C]/30 bg-[var(--card)] p-4">
          {children}
        </div>
      </div>
    </aside>
  );
}
