import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-4">
          Page not found
        </h1>
        <p className="text-secondary font-body mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="text-primary font-semibold hover:underline">
          Return home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
