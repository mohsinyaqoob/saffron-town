import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlogListing } from "@/components/blog/BlogListing";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/sections";
import { getBlogPostsPage } from "@/lib/blog-data";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 60;

const OG_IMAGE = `${SITE_CONFIG.url}/products-grid.png`;

type Props = {
  params: Promise<{ page: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: raw } = await params;
  const page = Number.parseInt(raw, 10);
  if (!Number.isFinite(page) || page < 2) {
    return {};
  }

  const canonical = `${SITE_CONFIG.url}/blog/page/${page}`;
  const title = `Saffron Blog — Page ${page} | Saffron Town`;
  const description =
    "Browse Kashmiri saffron guides — health benefits, recipes, and buying tips from Saffron Town.";

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Saffron Town blog — Kashmiri saffron guides",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function BlogListPagedPage({ params }: Props) {
  const { page: raw } = await params;
  const page = Number.parseInt(raw, 10);

  if (!Number.isFinite(page) || page < 1) notFound();
  if (page === 1) permanentRedirect("/blog");

  const {
    posts,
    totalPages,
    total,
    page: currentPage,
  } = await getBlogPostsPage(page);

  if (total > 0 && currentPage > totalPages) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PageHeader
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
          ]}
          title={`Saffron Blog — Page ${currentPage}`}
          description="Discover the stories behind our heritage crops and the science of natural well-being."
          badge="The Saffron Journal"
          size="compact"
          maxWidth="wide"
        />

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            {posts.length === 0 ? (
              <p className="text-center text-sm text-secondary font-body">
                No posts on this page.
              </p>
            ) : (
              <>
                <BlogListing posts={posts} />
                <BlogPagination page={currentPage} totalPages={totalPages} />
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
