"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui";
import { Stars } from "./Stars";
import { VendorReviewCard } from "./VendorReviewCard";
import { RatingLabelWithTooltip } from "./RatingTooltip";
import type { Review, ReviewWithProfile } from "@/types/database";
import type { Company } from "@/types/database";

type VendorReviewsSectionProps = {
  company: Company;
  reviews: ReviewWithProfile[];
};

function safeAvg(
  reviews: ReviewWithProfile[],
  key: keyof Review
): number {
  const vals = reviews
    .map((r) => (r as Record<string, unknown>)[key] as number | null | undefined)
    .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

export function VendorReviewsSection({ company, reviews }: VendorReviewsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReviews = useMemo(() => {
    if (!searchTerm.trim()) return reviews;
    const t = searchTerm.trim().toLowerCase();
    return reviews.filter(
      (r) =>
        r.title.toLowerCase().includes(t) ||
        (r.body?.toLowerCase().includes(t) ?? false) ||
        r.found_when?.toLowerCase().includes(t) ||
        r.result?.toLowerCase().includes(t)
    );
  }, [reviews, searchTerm]);

  const avgRating = safeAvg(reviews, "rating");
  const avgAccessibility = safeAvg(reviews, "ease_of_access_rating");
  const avgSalesTeam = safeAvg(reviews, "sales_team_rating");
  const avgDataCoverage = safeAvg(reviews, "data_coverage_rating");
  const avgValue = safeAvg(reviews, "value_rating");

  const distribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      if (r.rating == null) continue;
      const v = Math.round(r.rating);
      if (v >= 1 && v <= 5) counts[v as keyof typeof counts]++;
    }
    return counts;
  }, [reviews]);

  const totalForDistribution = Object.values(distribution).reduce((a, b) => a + b, 0);

  if (reviews.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-[#233620]">Reviews</h2>
        <div className="mt-4 rounded-xl border border-[#546B4C]/30 bg-[var(--card)] p-12 text-center text-[#546B4C]">
          <p className="font-medium">No reviews yet</p>
          <p className="mt-1 text-sm">Be the first to review this vendor.</p>
          <Link
            href={`/companies/${company.slug}/review`}
            className="mt-4 inline-block text-[#456926] hover:underline text-sm font-medium"
          >
            Write a review →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-[#233620]">Reviews</h2>

      <div className="mt-6 grid gap-6 rounded-xl border border-[#546B4C]/30 bg-[var(--card)] p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#546B4C]">
              <RatingLabelWithTooltip label="Overall" tooltipKey="rating" />
            </p>
            <Stars rating={avgRating} />
            <p className="mt-1 text-sm text-[#546B4C]">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#546B4C]">
              <RatingLabelWithTooltip label="Accessibility" tooltipKey="ease_of_access_rating" />
            </p>
            <Stars rating={avgAccessibility} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#546B4C]">
              <RatingLabelWithTooltip label="Sales Team" tooltipKey="sales_team_rating" />
            </p>
            <Stars rating={avgSalesTeam} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#546B4C]">
              <RatingLabelWithTooltip label="Data Coverage" tooltipKey="data_coverage_rating" />
            </p>
            <Stars rating={avgDataCoverage} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#546B4C]">
              <RatingLabelWithTooltip label="Value" tooltipKey="value_rating" />
            </p>
            <Stars rating={avgValue} />
          </div>
        </div>

        <div className="border-t border-[#546B4C]/20 pt-4">
          <p className="text-sm font-medium text-[#233620] mb-2">Rating distribution</p>
          <div className="space-y-2">
            {([5, 4, 3, 2, 1] as const).map((stars) => {
              const count = distribution[stars];
              const pct = totalForDistribution ? (count / totalForDistribution) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-16 text-[#546B4C]">{stars} star</span>
                  <div className="flex-1 h-2 bg-[#ACAEA1]/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#456926] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[#546B4C]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[#456926] font-medium hover:underline"
        >
          {expanded ? "Hide reviews" : "Show all reviews"}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            <div className="max-w-md">
              <label htmlFor="review-search" className="sr-only">
                Search reviews
              </label>
              <Input
                id="review-search"
                type="search"
                placeholder="Search in reviews…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search reviews"
              />
            </div>

            {filteredReviews.length === 0 ? (
              <p className="text-sm text-[#546B4C]">
                No reviews match &quot;{searchTerm}&quot;.
              </p>
            ) : (
              <ul className="space-y-4">
                {filteredReviews.map((review) => (
                  <li key={review.id}>
                    <VendorReviewCard
                      review={{ ...review, companies: { name: company.name, slug: company.slug } }}
                      searchTerm={searchTerm.trim() || undefined}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
