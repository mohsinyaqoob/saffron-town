import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

const FOOTER_COLUMNS: {
  heading: string;
  links: { href: string; label: string }[];
}[] = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop/saffron", label: "Mongra saffron" },
      { href: "/gifting", label: "Gifting" },
      { href: "/bulk-orders", label: "Bulk orders" },
      { href: "/prebook-2026-harvest", label: "Prebook harvest" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { href: "/blog", label: "Journal" },
      { href: "/our-story", label: "Our story" },
      { href: "/about", label: "About" },
      { href: "/lab-reports", label: "Lab reports" },
      { href: "/reviews", label: "Reviews" },
    ],
  },
  {
    heading: "Help & legal",
    links: [
      { href: "/", label: "Home" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/sitemap.xml", label: "Sitemap" },
    ],
  },
];

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-dark-text/90">
        {heading}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-body text-sm text-dark-text-muted transition-colors hover:text-dark-text"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="sm:col-span-2 lg:col-span-4 xl:col-span-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/logo-horizon.svg"
                alt={SITE_CONFIG.name}
                width={150}
                height={35}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-dark-text-muted font-body">
              {SITE_CONFIG.tagline}
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm font-body">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="w-fit text-dark-text-muted transition-colors hover:text-dark-text"
              >
                {SITE_CONFIG.phone}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="w-fit text-dark-text-muted transition-colors hover:text-dark-text"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
            {SITE_CONFIG.sameAs.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-4">
                {SITE_CONFIG.sameAs.map((href) => {
                  const host = (() => {
                    try {
                      return new URL(href).hostname.replace(/^www\./, "");
                    } catch {
                      return "Social";
                    }
                  })();
                  return (
                    <li key={href}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm text-dark-text-muted underline-offset-4 transition-colors hover:text-dark-text hover:underline"
                      >
                        {host.startsWith("instagram")
                          ? "Instagram"
                          : host.startsWith("facebook")
                            ? "Facebook"
                            : host.split(".")[0]}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-2 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-3">
            {FOOTER_COLUMNS.map((col) => (
              <FooterColumn key={col.heading} {...col} />
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-xs leading-relaxed text-dark-text-muted font-body sm:text-left">
            © {year} {SITE_CONFIG.name}. Farm-direct Kashmiri Mongra from
            Pampore.
          </p>
        </div>
      </div>
    </footer>
  );
}
