import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop/saffron", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/our-story", label: "Our Story" },
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
        <div className="mt-8 border-t border-dark-text-muted/20 pt-8">
          <p className="text-xs text-secondary font-body">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
