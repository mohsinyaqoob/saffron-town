import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getCategoryDisplayName, type ProductPageData } from "@/lib/product-data";

interface ProductCardProps {
  product: ProductPageData;
}

export function ProductCard({ product }: ProductCardProps) {
  const href = `/shop/${product.category}/${product.slug}`;
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: product.currency, maximumFractionDigits: 0 }).format(product.price);

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-[2rem] bg-background-alt shadow-xl shadow-dark/5 ring-1 ring-secondary-border/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
      itemScope
      itemType="https://schema.org/Product"
    >
      <Link href={href} className="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted">
        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 320px"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute top-4 left-4">
            <span className="backdrop-blur-md bg-white/70 text-dark px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-dark/5">
                {getCategoryDisplayName(product.category)}
            </span>
        </div>
      </Link>
      
      <div className="flex flex-col gap-4 p-8">
        <div>
          <Link href={href}>
            <h3
              className="font-display text-xl font-bold text-text-primary group-hover:text-primary transition-colors"
              itemProp="name"
            >
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-secondary font-body line-clamp-2">
            {product.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Price</span>
                <p className="font-display text-xl font-bold text-text-primary">
                    {formattedPrice}
                    <span className="text-xs font-normal text-text-muted ml-0.5">/ {product.unit}</span>
                </p>
            </div>
            <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg">
                <svg className="h-3 w-3 fill-primary text-primary" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-primary">{product.rating}</span>
            </div>
        </div>

        <Link
          href={href}
          className="mt-2"
        >
          <Button variant="primary" size="md" className="w-full rounded-2xl">
            View Details
          </Button>
        </Link>
      </div>
    </article>
  );
}
