import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui";
import type { Company } from "@/types/database";

type CompanyCardProps = {
  company: Company;
};

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.slug}`}>
      <Card className="h-full transition-all hover:shadow-md hover:border-[#6C8494]/50">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
          {company.logo_url ? (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#B8BFC1]/20">
              <Image
                src={company.logo_url}
                alt={`${company.name} logo`}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#2C4C5C]/10 font-bold text-lg text-[#2C4C5C]">
              {company.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-semibold text-[#2C4C5C]">{company.name}</h3>
              {(company.category || company.subcategory) && (
                <span className="text-xs text-[#6C8494]">
                  {[company.category, company.subcategory].filter(Boolean).join(" › ")}
                </span>
              )}
            </div>
            {company.description && (
              <p className="mt-1 text-sm text-[#6C8494] line-clamp-2">
                {company.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
