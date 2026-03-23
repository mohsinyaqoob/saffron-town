// src/app/not-found.tsx

import Link from "next/link";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background-alt pt-16">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-6 lg:px-20 pt-6">
          <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }]} />
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-bold text-text-primary mb-4">
            Page not found
          </h1>
          <p className="text-secondary font-body mb-8">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Browse shop
            </Link>
            <span className="text-secondary">|</span>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Read the blog
            </Link>
            <span className="text-secondary">|</span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Return home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
