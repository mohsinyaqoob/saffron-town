import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-background">
      <Image
        src="/images/harvest.png"
        alt=""
        fill
        priority
        aria-hidden
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/70"
        aria-hidden
      />

      <div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-20"
        data-home-hero
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <Badge
            variant="outline"
            className="border-white/30 bg-white/10 text-white"
          >
            THIS SEASON&apos;S HARVEST
          </Badge>
          <h1 className="font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
            Fresh Harvest Saffron Only
          </h1>
          <p className="text-base leading-relaxed text-white/90 font-body sm:text-lg">
            Grade A++ Pampore saffron, farm-direct and fresh harvest only.
            Transparent sourcing, ISO lab-tested quality, and zero old stock.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/shop/saffron">
              <Button size="md">Shop Saffron</Button>
            </Link>
            <Link href="/prebook-2026-harvest">
              <Button
                size="md"
                variant="outline"
                className="border-white/70 bg-white/10 text-white hover:bg-white hover:text-dark"
              >
                Prebook Harvest
              </Button>
            </Link>
            <Link href="/lab-reports">
              <Button
                size="md"
                variant="outline"
                className="border-white/70 bg-white/10 text-white hover:bg-white hover:text-dark"
              >
                Lab Reports
              </Button>
            </Link>
          </div>

          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              Farm Direct
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              ISO 3632 Lab-Tested
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              Money-back Guarantee
            </span>
          </div>
          <p className="text-xs text-white/75 font-body">
            Pure Kashmiri Mongra from Pampore
          </p>
          <div
            className="mt-2 inline-flex flex-col items-center text-white/80"
            aria-hidden
          >
            <span className="text-[11px] font-medium tracking-wide">
              Scroll
            </span>
            <svg
              className="mt-1 h-5 w-5 animate-bounce"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
