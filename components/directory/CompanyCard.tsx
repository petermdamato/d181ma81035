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
      <Card className="h-full transition-all hover:shadow-md hover:border-[#456926]/50">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          {company.logo_url ? (
            <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-[#ACAEA1]/20">
              <Image
                src={company.logo_url}
                alt={`${company.name} logo`}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="h-14 w-14 shrink-0 rounded-lg bg-[#546B4C]/20 flex items-center justify-center text-[#456926] font-bold text-lg">
              {company.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-[#233620] truncate">{company.name}</h3>
              {(company.category || company.subcategory) && (
                <span className="text-xs text-[#546B4C]">
                  {[company.category, company.subcategory].filter(Boolean).join(" › ")}
                </span>
              )}
            </div>
            {company.description && (
              <p className="mt-1 text-sm text-[#546B4C] line-clamp-2">
                {company.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
