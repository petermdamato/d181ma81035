import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
};

const variants = {
  primary:
    "bg-[#456926] text-white hover:bg-[#233620] border border-[#233620]",
  accent:
    "bg-[#B4442C] text-white hover:bg-[#6D1C07] border border-[#6D1C07]",
  outline:
    "border border-[#546B4C] text-[#071205] bg-transparent hover:bg-[#546B4C]/10",
  ghost:
    "text-[#071205] hover:bg-[#ACAEA1]/30",
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
