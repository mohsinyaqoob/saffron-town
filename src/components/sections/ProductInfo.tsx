import { Badge } from "@/components/ui/Badge";
import type { ProductPageData } from "@/lib/product-data";

interface ProductInfoProps {
  product: ProductPageData;
}

/**
 * Server-rendered product description for SEO — no client JS needed for crawlers.
 */
export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="mb-6">
        <Badge
          variant="outline"
          className="mb-4 py-1 px-3 text-primary border-primary/30 bg-primary/5 uppercase tracking-widest text-[10px] font-bold"
        >
          {product.heroBadge}
        </Badge>
        <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-5xl xl:text-6xl">
          {product.name}
        </h1>
        <p className="mt-4 text-xl font-medium text-primary font-display italic">
          {product.subtitle}
        </p>
      </div>

      <div className="mt-10 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-3">
            Distinguished Feature
          </h3>
          <p className="text-lg leading-relaxed text-secondary font-body">
            {product.heroSubline}
          </p>
        </div>

        <div className="space-y-4 pt-6 border-t border-secondary-border/20">
          <p className="text-base leading-relaxed text-text-primary/80 font-body">
            {product.description}
          </p>
          <p className="text-sm text-text-muted italic border-l-2 border-primary/30 pl-4 font-body">
            {product.origin}
          </p>
        </div>
      </div>
    </div>
  );
}
