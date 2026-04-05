import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-20 lg:flex-row lg:justify-between lg:px-20 lg:py-24">
        <div className="flex w-full max-w-[520px] flex-col items-start gap-6">
          <Badge variant="secondary">THIS SEASON&apos;S HARVEST</Badge>
          <h1 className="font-display text-4xl font-normal leading-tight text-text-primary lg:text-5xl">
            Premium Kashmiri Mongra Saffron
          </h1>
          <p className="text-lg leading-relaxed text-secondary font-body">
            Grade A++ Pampore saffron. Controlled from seeding to harvesting.
            Farm-direct. Fresh harvest only—no old stock. Money-back guarantee.
          </p>
          <div className="flex gap-4">
            <Link href="/lab-reports">
              <Button size="md" variant="outline">
                Lab Reports
              </Button>
            </Link>
            <Link href="/shop/saffron">
              <Button size="md">Shop Saffron</Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[340px] w-full max-w-[520px] overflow-hidden rounded-2xl lg:h-[420px]">
          <Image
            src="/images/hero.png"
            alt="Premium Kashmiri saffron, honey and almonds - Saffron Town products"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        </div>
      </div>
    </section>
  );
}
