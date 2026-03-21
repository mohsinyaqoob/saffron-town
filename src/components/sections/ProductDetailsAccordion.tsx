"use client";

import { useState } from "react";
import type { ProductPageData } from "@/lib/product-data";

interface ProductDetailsAccordionProps {
  product: ProductPageData;
}

/**
 * Amazon-style expandable product details: About this item, Product details, Specifications.
 */
export function ProductDetailsAccordion({
  product,
}: ProductDetailsAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["about", "description", "specs"]),
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sections = [
    {
      id: "about",
      title: "Top highlights",
      content: (
        <ul className="list-disc pl-5 space-y-2 text-sm text-text-primary font-body">
          {product.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
          <li>{product.origin}</li>
        </ul>
      ),
    },
    {
      id: "description",
      title: "Item details",
      content: (
        <div className="text-sm text-text-primary space-y-3 font-body">
          <p>{product.description}</p>
          <p>{product.description2}</p>
        </div>
      ),
    },
    {
      id: "specs",
      title: "Product specifications",
      content: (
        <table className="w-full text-sm font-body">
          <tbody>
            {Object.entries(product.specifications).map(([key, value]) => (
              <tr key={key} className="border-b border-secondary-border">
                <td className="py-2 pr-4 font-medium text-secondary align-top w-1/3">
                  {key}
                </td>
                <td className="py-2 text-text-primary">{value}</td>
              </tr>
            ))}
            <tr className="border-b border-secondary-border">
              <td className="py-2 pr-4 font-medium text-secondary align-top">
                Brand
              </td>
              <td className="py-2 text-text-primary">Saffron Town</td>
            </tr>
          </tbody>
        </table>
      ),
    },
  ];

  return (
    <div className="border border-secondary-border rounded-xl overflow-hidden">
      {sections.map(({ id, title, content }) => (
        <div
          key={id}
          className="border-b border-secondary-border last:border-b-0"
        >
          <button
            type="button"
            onClick={() => toggleSection(id)}
            className="w-full px-4 py-3 text-left flex items-center justify-between bg-surface-muted/80 hover:bg-surface/50 transition-colors"
          >
            <span className="font-medium text-text-primary text-sm font-display">
              {title}
            </span>
            <svg
              className={`w-4 h-4 text-secondary transition-transform ${
                openSections.has(id) ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections.has(id) && (
            <div className="px-5 py-4 bg-background-alt text-text-primary">
              {content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
