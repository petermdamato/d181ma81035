"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui";

type VendorSearchProps = {
  placeholder?: string;
  className?: string;
};

export function VendorSearch({
  placeholder = "Search vendors by name or description…",
  className,
}: VendorSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [value, setValue] = useState(q);

  useEffect(() => {
    setValue(q);
  }, [q]);

  const applySearch = useCallback(
    (nextQ: string) => {
      const next = new URLSearchParams(searchParams.toString());
      const trimmed = nextQ.trim();
      if (trimmed) {
        next.set("q", trimmed);
      } else {
        next.delete("q");
      }
      const query = next.toString();
      router.push(query ? `/companies?${query}` : "/companies", { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        applySearch(value);
      }}
    >
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search vendors"
        className="w-full"
      />
    </form>
  );
}
