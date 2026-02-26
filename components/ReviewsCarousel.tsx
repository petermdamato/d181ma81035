"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import type { Review } from "@/types/database";

type ReviewWithCompany = Review & {
  companies: { name: string; slug: string } | null;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[#B4442C]" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= rating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

type ReviewsCarouselProps = {
  reviews: ReviewWithCompany[];
};

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    const step = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-[#546B4C]/30 bg-[var(--card)] p-8 text-center text-[#546B4C]">
        <p className="font-medium">No reviews yet</p>
        <p className="mt-1 text-sm">Be the first to leave a review.</p>
        <Link href="/companies" className="mt-3 inline-block text-[#456926] hover:underline text-sm">
          Browse vendors →
        </Link>
      </div>
    );
  }

  return (
    <section className="relative" aria-label="New reviews">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-[#233620]">New reviews</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            onScroll={updateScrollState}
            aria-label="Previous reviews"
            className="h-9 w-9 rounded-lg border border-[#546B4C]/40 bg-white text-[#233620] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#ACAEA1]/20 transition-colors flex items-center justify-center"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next reviews"
            className="h-9 w-9 rounded-lg border border-[#546B4C]/40 bg-white text-[#233620] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#ACAEA1]/20 transition-colors flex items-center justify-center"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 scrollbar-thin"
        style={{ scrollbarWidth: "thin" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="w-[min(100%,320px)] shrink-0 snap-start"
          >
            <Card className="h-full">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#233620] line-clamp-2">
                      {review.title}
                    </h3>
                    {review.companies && (
                      <Link
                        href={`/companies/${review.companies.slug}`}
                        className="text-sm text-[#456926] hover:underline mt-0.5 inline-block"
                      >
                        {review.companies.name}
                      </Link>
                    )}
                  </div>
                  {review.rating != null && <Stars rating={review.rating} />}
                </div>
                {review.body && (
                  <p className="mt-2 text-sm text-[#546B4C] line-clamp-3 flex-1">
                    {review.body}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
