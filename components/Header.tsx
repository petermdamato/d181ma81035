import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#546B4C]/30 bg-[#071205]/95 backdrop-blur supports-[backdrop-filter]:bg-[#071205]/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white hover:text-[#ACAEA1] transition-colors"
        >
          Dataist
        </Link>
        <nav className="flex items-center gap-6">
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
          <Link href="/dashboard-protected-routes" className="cursor-pointer">
            <Button variant="outline" size="sm" className="border-[#ACAEA1] text-[#ACAEA1] hover:bg-[#ACAEA1]/10 cursor-pointer">
              Dashboard
            </Button>
          </Link>
          <Link href={user ? "/dashboard-protected-routes/profile" : "/login"} className="cursor-pointer">
            <Button variant="accent" size="sm" className="cursor-pointer">
              {user ? "Account" : "Sign in"}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
