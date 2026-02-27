import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";
import { VendorReviewsSection } from "@/components/reviews";
import { DeliveryMethods, DataPoints } from "@/components/company";
import { BookmarkButton } from "@/components/BookmarkButton";
import { fetchReviewsWithProfiles } from "@/lib/fetch-reviews-with-profiles";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("slug", slug)
    .single();

  if (!company) return { title: "Vendor not found" };
  return { title: `${company.name} – Source Signal`, description: `Reviews and info for ${company.name}` };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !company) notFound();

  const deliveryMethodIds = company.delivery_method_ids ?? [];
  const dataAttributeIds = company.data_attribute_ids ?? [];

  const [reviews, bookmarked, user, deliveryMethodsRows, dataAttributesRows] = await Promise.all([
    fetchReviewsWithProfiles(supabase, { companyId: company.id }),
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return false;
      const { data } = await supabase
        .from("user_bookmarks")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("company_id", company.id)
        .single();
      return !!data;
    }),
    supabase.auth.getUser().then(({ data: { user } }) => user),
    deliveryMethodIds.length > 0
      ? supabase.from("data_delivery_methods").select("id, name").in("id", deliveryMethodIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
    dataAttributeIds.length > 0
      ? supabase.from("data_attributes").select("id, name").in("id", dataAttributeIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
  ]);

  const deliveryMethodNames =
    deliveryMethodsRows.data?.slice().sort(
      (a, b) => deliveryMethodIds.indexOf(a.id) - deliveryMethodIds.indexOf(b.id)
    ).map((r) => r.name) ?? [];
  const dataPointNames =
    dataAttributesRows.data?.slice().sort(
      (a, b) => dataAttributeIds.indexOf(a.id) - dataAttributeIds.indexOf(b.id)
    ).map((r) => r.name) ?? [];

  const canEdit =
    user &&
    (!company.claimed || (company.claimed_by_user_id != null && company.claimed_by_user_id === user.id));
  const showClaimLink = !company.claimed && !!company.website_url?.trim();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        {company.logo_url ? (
          <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-[#ACAEA1]/20">
            <Image
              src={company.logo_url}
              alt={`${company.name} logo`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#546B4C]/20 text-[#456926] font-bold text-3xl">
            {company.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3 gap-y-1">
            <h1 className="text-2xl font-bold text-[#233620] sm:text-3xl">{company.name}</h1>
            {company.claimed && (
              <span
                className={
                  user && company.claimed_by_user_id === user.id
                    ? "inline-flex items-center rounded-md bg-[#456926] px-2.5 py-0.5 text-xs font-medium text-white"
                    : "inline-flex items-center rounded-md bg-[#546B4C]/20 px-2.5 py-0.5 text-xs font-medium text-[#546B4C]"
                }
              >
                {user && company.claimed_by_user_id === user.id ? "CLAIMED BY YOU" : "CLAIMED"}
              </span>
            )}
          </div>
          {company.description && (
            <p className="mt-2 text-[#546B4C]">{company.description}</p>
          )}
          {company.website_url && (
            <a
              href={company.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#546B4C]/50 bg-white px-4 py-2 text-sm font-medium text-[#456926] hover:bg-[#ACAEA1]/10 transition-colors"
            >
              Visit website
              <span aria-hidden>↗</span>
            </a>
          )}
          <div className="mt-4 flex flex-col gap-2">
            <DeliveryMethods methods={deliveryMethodNames} />
            <DataPoints names={dataPointNames} />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:shrink-0">
          <BookmarkButton
            companyId={company.id}
            companySlug={company.slug}
            isBookmarked={bookmarked}
            variant="button"
          />
          {canEdit && (
            <Link href={`/companies/${slug}/edit`} className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                Edit profile
              </Button>
            </Link>
          )}
          {showClaimLink && (
            <Link href={`/companies/${slug}/claim`} className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                Claim this company
              </Button>
            </Link>
          )}
          <Link href={`/companies/${slug}/review`} className="w-full sm:w-auto">
            <Button variant="accent" size="md" className="w-full sm:w-auto">
              Write a review
            </Button>
          </Link>
        </div>
      </div>

      <VendorReviewsSection company={company} reviews={reviews} />
    </div>
  );
}
