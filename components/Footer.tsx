import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#546B4C]/30 bg-[#071205] text-[#ACAEA1]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-lg font-semibold text-white hover:text-[#ACAEA1] transition-colors"
          >
            Dataist
          </Link>
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link href="/companies" className="hover:text-white transition-colors">
              Browse vendors
            </Link>
            <Link href="/reviews" className="hover:text-white transition-colors">
              Reviews
            </Link>
            <Link href="/dashboard-protected-routes" className="hover:text-white transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-sm text-[#546B4C]">
          The directory for data vendor reviews. Share your experience and help others choose.
        </p>
      </div>
    </footer>
  );
}
