"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleBookmark } from "@/app/actions/bookmarks";

type BookmarkButtonProps = {
  companyId: string;
  companySlug: string;
  isBookmarked: boolean;
  variant?: "icon" | "button";
};

export function BookmarkButton({
  companyId,
  companySlug,
  isBookmarked,
  variant = "icon",
}: BookmarkButtonProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await toggleBookmark(companyId, companySlug);
      if (result?.error) {
        router.push(`/login?next=/companies/${companySlug}`);
      } else {
        router.refresh();
      }
    });
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border border-[#546B4C]/50 bg-white px-3 py-2 text-sm font-medium text-[#233620] hover:bg-[#ACAEA1]/10 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isBookmarked ? (
          <>
            <span aria-hidden>★</span>
            Saved
          </>
        ) : (
          <>
            <span aria-hidden className="text-[#ACAEA1]">☆</span>
            Save
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded p-1.5 text-lg transition-colors hover:bg-[#ACAEA1]/20 disabled:opacity-50 cursor-pointer"
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark company"}
      title={isBookmarked ? "Remove bookmark" : "Bookmark company"}
    >
      {isBookmarked ? (
        <span className="text-[#B4442C]" aria-hidden>★</span>
      ) : (
        <span className="text-[#ACAEA1] hover:text-[#546B4C]" aria-hidden>☆</span>
      )}
    </button>
  );
}
