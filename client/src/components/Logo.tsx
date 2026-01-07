import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "black" | "white";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, variant = "black", size = "md" }: LogoProps) {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  return (
    <img
      src="/logo.svg"
      alt="PitchChat Logo"
      className={cn(
        sizeMap[size],
        variant === "white" && "invert", // Simple way to handle white variant if needed, or we can use another SVG
        className
      )}
    />
  );
}
