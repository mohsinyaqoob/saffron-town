import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { FooterJournalLinks } from "./FooterJournalLinks";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/prebook-2026-harvest", label: "Prebook" },
  { href: "/shop/saffron", label: "Mongra Saffron" },
  { href: "/gifting", label: "Gifting" },
  { href: "/lab-reports", label: "Lab Reports" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
  { href: "/our-story", label: "Our Story" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function Footer() {
  return (
    <footer className="bg-dark">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-horizon.svg"
                alt={SITE_CONFIG.name}
                width={150}
                height={35}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-1 text-sm text-dark-text-muted font-body">
              {SITE_CONFIG.tagline}
            </p>
            <p className="mt-3 text-sm font-body">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="text-dark-text-muted hover:text-dark-text transition-colors"
              >
                {SITE_CONFIG.phone}
              </a>
            </p>
          </div>
          <div className="flex gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-dark-text-muted hover:text-dark-text transition-colors font-body"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <FooterJournalLinks />
        <div className="mt-8 border-t border-dark-text-muted/20 pt-8">
          <div className="mb-8 sm:mb-10">
            <div className="mx-auto w-full min-w-0 max-w-4xl">
              <div className="relative w-full aspect-[1774/887]">
                <Image
                  src="/images/trust-badges.png"
                  alt="Trust badges: secure payment, quality guarantees, and recognised certifications for Saffron Town"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-secondary font-body">
            © {new Date().getFullYear()} Saffron Town. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
