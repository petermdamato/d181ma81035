"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

type SignOutButtonProps = {
  variant?: "ghost" | "outline" | "primary" | "accent";
  size?: "sm" | "md" | "lg";
};

export function SignOutButton({ variant = "ghost", size = "sm" }: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("source-signal-claim-notification-dismissed");
    }
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant={variant} size={size} onClick={handleSignOut}>
      Log out
    </Button>
  );
}
