import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";
import { MobileMenu } from "@/components/MobileMenu";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#546B4C]/30 bg-[#071205]/95 backdrop-blur supports-[backdrop-filter]:bg-[#071205]/80">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4">

        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-2">
          <MobileMenu isLoggedIn={!!user} />
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white hover:text-[#ACAEA1] transition-colors"
          >
            Source Signal
          </Link>
        </div>

        {/* Desktop nav — visible at 551px+ */}
        <nav className="hidden min-[551px]:flex items-center gap-6">
          <Link
            href="/companies"
            className="text-sm font-medium text-[#ACAEA1] hover:text-white transition-colors"
          >
            Vendors
          </Link>
          <Link
            href="/reviews"
            className="text-sm font-medium text-[#ACAEA1] hover:text-white transition-colors"
          >
            Reviews
          </Link>
          <Link href="/dashboard-protected-routes">
            <Button variant="outline" size="sm" className="border-[#ACAEA1] text-[#ACAEA1] hover:bg-[#ACAEA1]/10">
              Dashboard
            </Button>
          </Link>
          <Link href={user ? "/dashboard-protected-routes/profile" : "/login"}>
            <Button variant="accent" size="sm">
              {user ? "Account" : "Sign in"}
            </Button>
          </Link>
        </nav>

        {/* Mobile sign-in button — right side, hidden at 551px+ */}
        <Link
          href={user ? "/dashboard-protected-routes/profile" : "/login"}
          className="min-[551px]:hidden"
        >
          <Button variant="accent" size="sm">
            {user ? "Account" : "Sign in"}
          </Button>
        </Link>

      </div>
    </header>
  );
}
