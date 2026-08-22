import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  nameClassName?: string;
  size?: "sm" | "md" | "lg";
};

const logoSizes = {
  sm: { pixels: 28, className: "h-7 w-7" },
  md: { pixels: 36, className: "h-9 w-9" },
  lg: { pixels: 42, className: "h-10.5 w-10.5" }
};

export function BrandLogo({
  className,
  nameClassName,
  size = "md"
}: BrandLogoProps) {
  const logoSize = logoSizes[size];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/loopchat-mark.svg"
        alt=""
        width={logoSize.pixels}
        height={logoSize.pixels}
        className={cn("shrink-0", logoSize.className)}
      />
      <span className={cn("font-semibold tracking-normal", nameClassName)}>
        LoopChat
      </span>
    </span>
  );
}
