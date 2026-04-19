import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function OrderConfirmationNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Header />
      <main className="flex-grow px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
            Order not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-secondary font-body">
            This confirmation link is invalid or incomplete. If you just placed
            an order, use the link from your checkout confirmation, or contact
            us with your order details.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block text-sm font-semibold text-primary underline-offset-2 hover:underline"
          >
            Contact us
          </Link>
          <p className="mt-4">
            <Link
              href="/"
              className="text-sm text-secondary underline-offset-2 hover:underline"
            >
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
