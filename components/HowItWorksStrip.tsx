import Link from "next/link";

export function HowItWorksStrip() {
  return (
    <section
      className="border-y border-[#546B4C]/30 bg-[#233620] text-white"
      aria-label="How the platform works"
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-center text-[#ACAEA1] mb-12">
          How Source Signal works
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#456926] text-xl font-bold text-white">
              1
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Browse & search vendors
            </h3>
            <p className="mt-2 text-sm text-[#ACAEA1] leading-relaxed">
              Search or filter by category to find data vendors. View vendor profiles and read reviews from the community to compare options before you reach out.
            </p>
            <Link
              href="/companies"
              className="mt-4 text-sm font-medium text-[#ACAEA1] hover:text-white transition-colors"
            >
              Browse vendors →
            </Link>
          </div>

          <div className="flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#456926] text-xl font-bold text-white">
              2
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Leave reviews (sign up to contribute)
            </h3>
            <p className="mt-2 text-sm text-[#ACAEA1] leading-relaxed">
              Once you’re signed up, you can leave reviews to help others. We focus on what matters: <strong className="text-white">utility of the data</strong>, <strong className="text-white">ease of contacting sales and negotiating the sales process</strong>, <strong className="text-white">type of data transfer</strong>, and <strong className="text-white">quality of the data product for the price</strong>.
            </p>
            <Link
              href="/login"
              className="mt-4 text-sm font-medium text-[#ACAEA1] hover:text-white transition-colors"
            >
              Sign up to review →
            </Link>
          </div>

          <div className="flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B4442C] text-xl font-bold text-white">
              3
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Add vendors to your dashboard
            </h3>
            <p className="mt-2 text-sm text-[#ACAEA1] leading-relaxed">
              Keep track of vendors you care about. Add them to your dashboard so you can quickly return to their profiles, compare notes, and see new reviews.
            </p>
            <Link
              href="/dashboard-protected-routes"
              className="mt-4 text-sm font-medium text-[#ACAEA1] hover:text-white transition-colors"
            >
              Go to dashboard →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
