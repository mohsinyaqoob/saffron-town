import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  formatBulkEnquiryTatHours,
  parseBulkEnquiryTatHours,
} from "@/lib/bulk-enquiry-tat";
import { SITE_CONFIG } from "@/lib/constants";
import { formatIndiaDisplay, telHref, whatsappChatUrl } from "@/lib/phone";

export const metadata: Metadata = {
  title: "Enquiry received | Bulk orders | Saffron Town",
  description:
    "Your wholesale saffron enquiry has been received. Our team will respond by phone or WhatsApp.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ hours?: string }>;
};

export default async function BulkEnquiryThankYouPage({ searchParams }: Props) {
  const { hours: hoursRaw } = await searchParams;
  const tatHours = parseBulkEnquiryTatHours(hoursRaw);
  if (tatHours === null) {
    redirect("/bulk-orders");
  }

  const tatLabel = formatBulkEnquiryTatHours(tatHours);
  const phonePretty = formatIndiaDisplay(SITE_CONFIG.phone);
  const tel = telHref(SITE_CONFIG.phone);
  const wa = whatsappChatUrl(SITE_CONFIG.phone);

  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Header />
      <main className="flex-grow pb-16">
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-20">
          <BreadcrumbNav
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Bulk orders", href: "/bulk-orders" },
              { label: "Enquiry received", href: "#" },
            ]}
          />
        </div>

        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="relative mb-6 sm:mb-8">
              <div
                className="absolute inset-0 scale-150 rounded-full bg-emerald-500/20 blur-2xl"
                aria-hidden
              />
              <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-emerald-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-4 ring-emerald-200/70 sm:h-20 sm:w-20">
                <svg
                  className="h-9 w-9 text-emerald-700 sm:h-10 sm:w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Enquiry received
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Your query has been sent
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-secondary font-body">
              Thank you for reaching out. We receive a high volume of wholesale
              enquiries, and our team reviews each one personally.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-emerald-200/45 bg-gradient-to-br from-background-alt from-40% to-emerald-50/40 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-900 font-body">
              Expected response time
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-text-primary">
              Within {tatLabel}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-secondary font-body">
              We will call or WhatsApp you on the number you shared. If your
              requirement is urgent, use the buttons below—we often pick up
              faster on a direct call.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href={tel}
              className="flex min-h-[52px] flex-col justify-center rounded-2xl border border-primary/25 bg-primary px-4 py-3 text-center text-white shadow-md shadow-primary/15 transition hover:bg-primary-hover"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                Call us
              </span>
              <span className="font-display text-lg font-semibold">
                {phonePretty}
              </span>
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] flex-col justify-center rounded-2xl border border-emerald-700/30 bg-emerald-800 px-4 py-3 text-center text-white shadow-md transition hover:bg-emerald-900"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-100/90">
                WhatsApp
              </span>
              <span className="font-display text-lg font-semibold">
                Message on WhatsApp
              </span>
            </a>
          </div>

          <p className="mt-10 text-center text-sm text-text-muted font-body sm:text-left">
            <Link
              href="/bulk-orders"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              ← Back to bulk orders
            </Link>
            {" · "}
            <Link
              href="/shop/saffron"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Shop retail packs
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
