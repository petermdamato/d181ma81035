import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 rounded-lg border border-[#6C8494]/40 bg-white text-[#2C4C5C] placeholder:text-[#B8BFC1] focus:outline-none focus:ring-2 focus:ring-[#6C8494] focus:border-transparent",
        className
      )}
      {...props}
    />
  );
}
