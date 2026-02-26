"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CompanyProfileUpdateState = { error?: string; ok?: boolean };

export async function updateCompanyDeliveryAndAttributes(
  companyId: string,
  companySlug: string,
  deliveryMethodIds: string[],
  dataAttributeIds: string[]
): Promise<CompanyProfileUpdateState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to update this." };

  const { error } = await supabase
    .from("companies")
    .update({
      delivery_method_ids: deliveryMethodIds,
      data_attribute_ids: dataAttributeIds,
      updated_at: new Date().toISOString(),
    })
    .eq("id", companyId);

  if (error) return { error: error.message };
  revalidatePath(`/companies/${companySlug}`);
  revalidatePath(`/companies/${companySlug}/edit`);
  return { ok: true };
}

/** Create a new data attribute with public = false (custom tag). Returns the new id. */
export async function createCustomDataAttribute(name: string): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to add custom attributes." };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required." };

  const { data, error } = await supabase
    .from("data_attributes")
    .insert({ name: trimmed, public: false })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}
