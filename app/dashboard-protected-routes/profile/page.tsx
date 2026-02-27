import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileEditForm } from "./ProfileEditForm";
import { SignOutButton } from "../SignOutButton";

export const metadata = {
  title: "Profile",
  description: "Edit your profile.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard-protected-routes/profile");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/dashboard-protected-routes"
        className="text-sm text-[#6C8494] hover:text-[#2C4C5C] hover:underline transition-colors"
      >
        ← Back to dashboard
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-[#2C4C5C]">Profile</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-[#6C8494]">
          Signed in as <strong className="text-[#2C4C5C]">{user.email}</strong>
        </span>
        <SignOutButton variant="outline" />
      </div>

      <div className="mt-8">
        <ProfileEditForm />
      </div>
    </div>
  );
}
