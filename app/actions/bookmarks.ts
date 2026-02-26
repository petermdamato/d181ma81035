"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleBookmark(companyId: string, companySlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in to bookmark companies." };
  }

  const { data: existing } = await supabase
    .from("user_bookmarks")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("company_id", companyId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("user_bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("company_id", companyId);

    if (error) return { error: error.message };
    revalidatePath("/dashboard-protected-routes");
    revalidatePath(`/companies/${companySlug}`);
    revalidatePath("/companies");
    return { bookmarked: false };
  } else {
    const { error } = await supabase
      .from("user_bookmarks")
      .insert({ user_id: user.id, company_id: companyId });

    if (error) return { error: error.message };
    revalidatePath("/dashboard-protected-routes");
    revalidatePath(`/companies/${companySlug}`);
    revalidatePath("/companies");
    return { bookmarked: true };
  }
}
