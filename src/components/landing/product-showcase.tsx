import Image from "next/image";

export function ProductShowcase() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-white shadow-2xl shadow-black/20">
      <Image
        src="/images/loopchat-product-showcase.png"
        alt="LoopChat group conversation interface showing the Project Phoenix chat"
        width={1820}
        height={865}
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
