import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SparkleIcon } from "@/components/icons/SparkleIcon";
import { Button } from "@/components/ui";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { NewVendorsRibbon } from "@/components/NewVendorsRibbon";
import { HowItWorksStrip } from "@/components/HowItWorksStrip";
import { fetchReviewsWithProfiles } from "@/lib/fetch-reviews-with-profiles";

export default async function Home() {
  const supabase = await createClient();

  const [reviewsResult, companiesResult] = await Promise.all([
    fetchReviewsWithProfiles(supabase, { limit: 12 }),
    supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const recentReviews = reviewsResult ?? [];
  const newVendors = companiesResult.data ?? [];

  return (
    <div className="min-h-[80vh]">
      <section className="relative overflow-hidden bg-[#071205] text-white">
        <div className="absolute inset-0 bg-[#233620]/50" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            The directory for{" "}
            <span className="text-[#ACAEA1]">data vendor</span> reviews
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[#ACAEA1]">
            Discover and compare data providers. Read real reviews from people
            who use them—and add your own.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/reviews">
              <Button
                variant="outline"
                size="lg"
                className="border-[#ACAEA1] text-[#ACAEA1] hover:bg-[#ACAEA1]/10"
              >
                See reviews
              </Button>
            </Link>
            <Link href="/companies">
              <Button
                variant="accent"
                size="lg"
                className="bg-[#B4442C] hover:bg-[#6D1C07]"
              >
                Browse vendors
              </Button>
            </Link>
            <Link href="/search/ai">
              <Button
                variant="primary"
                size="lg"
                className="gap-2 bg-[#456926] hover:bg-[#233620]"
              >
                <div style={{ gap: "8px", display: "flex" }}>
                  Search vendors with AI
                  <SparkleIcon className="h-5 w-5" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <ReviewsCarousel reviews={recentReviews as never} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <NewVendorsRibbon companies={newVendors} />
      </section>

      <HowItWorksStrip />
    </div>
  );
}
