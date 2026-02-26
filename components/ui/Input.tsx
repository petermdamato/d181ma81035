import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 rounded-lg border border-[#546B4C]/50 bg-white text-[#071205] placeholder:text-[#ACAEA1] focus:outline-none focus:ring-2 focus:ring-[#456926] focus:border-transparent",
        className
      )}
      {...props}
    />
  );
}
