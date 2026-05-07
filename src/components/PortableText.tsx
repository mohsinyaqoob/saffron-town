import { PortableText as PortableTextReact } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import Link from "next/link";
import { IMAGE_QUALITY_CONTENT } from "@/lib/constants";
import { urlFor } from "@/sanity/image";

function isExternalUrl(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

const components = {
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href?: string };
    }) => {
      const href = value?.href ?? "#";
      if (isExternalUrl(href)) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className="text-primary font-semibold hover:underline"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({
      value,
    }: {
      value: { asset?: { _ref?: string }; alt?: string; caption?: string };
    }) => {
      if (!value?.asset) return null;
      const src = urlFor(value)
        .width(1200)
        .height(675)
        .format("webp")
        .quality(IMAGE_QUALITY_CONTENT)
        .url();
      return (
        <figure className="my-12">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={src}
              alt={value.alt || "Kashmiri saffron blog post image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              quality={IMAGE_QUALITY_CONTENT}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-4 text-center text-sm text-secondary font-body">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-display text-4xl font-bold text-text-primary mt-12 mb-6 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-display text-2xl font-bold text-text-primary mt-10 mb-4 tracking-tight">
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-primary pl-8 py-2 my-16 italic text-2xl text-text-primary leading-relaxed">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-lg leading-relaxed text-secondary font-body mb-10">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-4 mb-10 text-lg text-secondary font-body">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-4 mb-10 text-lg text-secondary font-body">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="mb-4">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="mb-4">{children}</li>
    ),
  },
};

interface PortableTextProps {
  value: PortableTextBlock[];
}

export function PortableText({ value }: PortableTextProps) {
  return <PortableTextReact value={value} components={components} />;
}
