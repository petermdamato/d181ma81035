"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui";
import type { Company } from "@/types/database";

type NewVendorsRibbonProps = {
  companies: Company[];
};

export function NewVendorsRibbon({ companies }: NewVendorsRibbonProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(companies.length > 3);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -280 : 280, behavior: "smooth" });
  }

  if (companies.length === 0) {
    return (
      <section className="rounded-xl border border-[#6C8494]/25 bg-[#B8BFC1]/15 px-6 py-8">
        <h2 className="mb-4 text-lg font-semibold text-[#2C4C5C]">New vendors</h2>
        <p className="text-sm text-[#6C8494]">No vendors yet. Check back soon.</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#6C8494]/25 bg-[#B8BFC1]/15" aria-label="New vendors">
      <div className="flex items-center justify-between gap-4 px-4 pb-2 pt-4">
        <h2 className="text-lg font-semibold text-[#2C4C5C]">New vendors</h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous vendors"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-[#6C8494]/25 bg-white text-[#6C8494] transition-colors hover:bg-[#B8BFC1]/40 hover:text-[#2C4C5C] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next vendors"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-[#6C8494]/25 bg-white text-[#6C8494] transition-colors hover:bg-[#B8BFC1]/40 hover:text-[#2C4C5C] disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 pb-4"
        style={{ scrollbarWidth: "thin" }}
      >
        {companies.map((company) => (
          <Link key={company.id} href={`/companies/${company.slug}`} className="w-64 shrink-0 snap-start">
            <Card className="h-full transition-all hover:shadow-md hover:border-[#6C8494]/50">
              <CardContent className="flex items-center gap-3 p-3">
                {company.logo_url ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image src={company.logo_url} alt="" fill className="object-contain" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2C4C5C]/10 font-bold text-[#2C4C5C]">
                    {company.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[#2C4C5C]">{company.name}</p>
                  {(company.category || company.subcategory) && (
                    <p className="truncate text-xs text-[#6C8494]">
                      {[company.category, company.subcategory].filter(Boolean).join(" › ")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
