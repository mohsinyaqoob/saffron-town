import { getAllProducts } from "@/lib/product-data";
import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  const products = getAllProducts();
  
  return (
    <section
      id="products"
      className="bg-background py-20"
      aria-labelledby="products-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        <div className="mb-10 space-y-3 text-center lg:text-left">
          <h2
            id="products-heading"
            className="font-display text-4xl font-semibold text-text-primary"
          >
            Our Collection
          </h2>
          <p className="text-lg text-secondary font-body max-w-2xl">
            Fresh from this harvest. Saffron, almonds, walnuts & honey from Kashmir.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary font-body justify-center lg:justify-start">
            <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Fresh Harvest
            </span>
            <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free India-wide Shipping
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
