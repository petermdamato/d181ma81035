import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CompanyList, CategoryNav, VendorSearch } from "@/components/directory";
import { FilterSidebar } from "@/components/directory/FilterSidebar";
import { isCategory, isSubcategoryOf } from "@/lib/categories";

export const metadata = {
  title: "Data vendors",
  description: "Browse data vendors by category and read reviews.",
};

type PageProps = {
  searchParams: Promise<{ category?: string; subcategory?: string; q?: string }>;
};

export default async function CompaniesPage({ searchParams }: PageProps) {
  const { category, subcategory, q: searchQuery } = await searchParams;

  const supabase = await createClient();
  let query = supabase.from("companies").select("*").order("name");

  if (category && isCategory(category)) {
    query = query.eq("category", category);
    if (subcategory && isSubcategoryOf(category, subcategory)) {
      query = query.eq("subcategory", subcategory);
    }
  }

  if (searchQuery && searchQuery.trim()) {
    const term = `%${searchQuery.trim()}%`;
    query = query.or(`name.ilike.${term},description.ilike.${term}`);
  }

  const { data: companies } = await query;

  const heading =
    category && subcategory
      ? `${category} › ${subcategory}`
      : category
        ? category
        : "Data vendors";
  const description =
    searchQuery && searchQuery.trim()
      ? category && subcategory
        ? `Vendors in ${subcategory} (${category}) matching "${searchQuery.trim()}".`
        : category
          ? `Vendors in ${category} matching "${searchQuery.trim()}".`
          : `Vendors matching "${searchQuery.trim()}".`
      : category && subcategory
        ? `Vendors in ${subcategory} (${category}).`
        : category
          ? `Vendors in ${category}. Select a subcategory to narrow down.`
          : "Browse and compare data providers. Use search and filters to narrow by category.";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <FilterSidebar>
          <Suspense
            fallback={
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-24 rounded bg-[#B8BFC1]/40" />
                <div className="h-8 w-full rounded bg-[#B8BFC1]/30" />
                <div className="h-8 w-full rounded bg-[#B8BFC1]/30" />
                <div className="h-8 w-full rounded bg-[#B8BFC1]/30" />
              </div>
            }
          >
            <CategoryNav />
          </Suspense>
        </FilterSidebar>

        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-[#2C4C5C]">{heading}</h1>
          <p className="mt-2 text-[#6C8494]">{description}</p>
          <div className="mt-6">
            <Suspense fallback={<div className="h-10 rounded-lg bg-[#B8BFC1]/30" />}>
              <VendorSearch className="max-w-md" />
            </Suspense>
          </div>
          <div className="mt-8">
            <CompanyList companies={companies ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
