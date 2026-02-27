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
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - 1
    );
  }

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  }

  if (companies.length === 0) {
    return (
      <section className="rounded-xl border border-[#546B4C]/30 bg-[#ACAEA1]/10 px-6 py-8">
        <h2 className="text-lg font-semibold text-[#233620] mb-4">New vendors</h2>
        <p className="text-sm text-[#546B4C]">No vendors yet. Check back soon.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#546B4C]/30 bg-[#ACAEA1]/10 overflow-hidden" aria-label="New vendors">
      <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-2">
        <h2 className="text-lg font-semibold text-[#233620]">New vendors</h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous vendors"
            className="h-11 w-11 rounded-md border border-[#546B4C]/40 bg-white text-[#233620] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#ACAEA1]/30 transition-colors flex items-center justify-center"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next vendors"
            className="h-11 w-11 rounded-md border border-[#546B4C]/40 bg-white text-[#233620] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#ACAEA1]/30 transition-colors flex items-center justify-center"
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
          <Link
            key={company.id}
            href={`/companies/${company.slug}`}
            className="w-64 shrink-0 snap-start"
          >
            <Card className="h-full transition-all hover:shadow-md hover:border-[#456926]/50">
              <CardContent className="p-3 flex items-center gap-3">
                {company.logo_url ? (
                  <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-white">
                    <Image
                      src={company.logo_url}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-[#546B4C]/20 flex items-center justify-center text-[#456926] font-bold">
                    {company.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#233620] truncate">{company.name}</p>
                  {(company.category || company.subcategory) && (
                    <p className="text-xs text-[#546B4C] truncate">
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
