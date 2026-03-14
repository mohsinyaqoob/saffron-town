import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/blog-data";
import { Badge } from "@/components/ui/Badge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* Article Header */}
        <section className="bg-surface-muted/30 pt-16 lg:pt-24 pb-32 lg:pb-48">
          <div className="mx-auto max-w-4xl px-6 lg:px-20 text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-8 group">
                <svg className="h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                The Saffron Journal
            </Link>
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary lg:text-6xl mb-8 leading-tight">
                {post.title}
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-text-muted font-body">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary animate-pulse">
                        {post.author.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div className="text-left">
                        <span className="block font-bold text-text-primary underline decoration-primary/30 underline-offset-4">{post.author}</span>
                        <span className="block text-xs uppercase tracking-tighter">Himalayan Specialist</span>
                    </div>
                </div>
                <div className="hidden md:block h-8 w-px bg-secondary-border/20" />
                <div className="flex flex-col items-center md:items-start">
                    <span className="block font-medium text-text-primary">{post.date}</span>
                    <span className="block text-xs uppercase tracking-tighter">{post.readTime}</span>
                </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="mx-auto max-w-4xl px-6 lg:px-20 relative -mt-32 lg:-mt-40 z-10 pb-24">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[3rem] shadow-2xl shadow-dark/10 ring-1 ring-secondary-border/10 mb-16 bg-surface-muted">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-dark/20 to-transparent pointer-events-none" />
            </div>

            <div className="prose prose-lg max-w-none text-secondary font-body leading-relaxed prose-headings:font-display prose-headings:text-text-primary prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:mb-8 prose-strong:text-text-primary prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-xl">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Content Footer/Tags */}
            <div className="mt-16 pt-16 border-t border-secondary-border/10 flex flex-wrap gap-4">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest mr-4">Tagged Under:</span>
                <Badge variant="outline">{post.category}</Badge>
                <Badge variant="outline">Sustainable Farming</Badge>
                <Badge variant="outline">Health & Wellness</Badge>
            </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
