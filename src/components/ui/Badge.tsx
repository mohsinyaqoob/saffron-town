import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export function Badge({ children, variant = "secondary", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-[10px] font-bold tracking-widest uppercase font-body",
        {
          "bg-primary text-white": variant === "primary",
          "bg-secondary-muted text-secondary": variant === "secondary",
          "border border-primary/30 bg-primary/5 text-primary": variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
