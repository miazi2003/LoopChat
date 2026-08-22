import { BrandLogo } from "@/components/brand-logo";
import { Reveal } from "@/components/shared/reveal";

export function Footer() {
  return (
    <footer className="bg-[#f8fbfa] px-5 py-8 sm:px-8">
      <Reveal direction="none">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#527278] sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo
            size="sm"
            className="text-[#0b343a]"
            nameClassName="text-sm"
          />
          <p>Realtime conversations, made simple.</p>
        </div>
      </Reveal>
    </footer>
  );
}
