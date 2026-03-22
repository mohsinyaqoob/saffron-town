import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CtaSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center lg:px-20">
        <h2 className="font-display text-3xl font-medium text-text-primary">
          Ready to shop?
        </h2>
        <p className="text-base text-secondary font-body">
          Fresh harvest. Farm-direct. Money-back guarantee.
        </p>
        <Link href="/shop/saffron">
          <Button size="lg" className="min-w-[44px] min-h-[44px]">
            Buy verified Kashmiri saffron
          </Button>
        </Link>
      </div>
    </section>
  );
}
