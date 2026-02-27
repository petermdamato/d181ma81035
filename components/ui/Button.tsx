import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
};

const variants = {
  primary:
    "bg-[#2C4C5C] text-white hover:bg-[#1e3642] border border-[#1e3642]",
  accent:
    "bg-[#6C8494] text-white hover:bg-[#4a6070] border border-[#4a6070]",
  outline:
    "border border-[#2C4C5C] text-[#2C4C5C] bg-transparent hover:bg-[#2C4C5C]/10",
  ghost:
    "text-[#2C4C5C] hover:bg-[#B8BFC1]/50",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-lg",
  lg: "px-6 py-3 text-lg rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
