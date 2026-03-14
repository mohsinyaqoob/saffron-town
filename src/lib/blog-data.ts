import blogs from "@/data/blogs.json";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
};

export function getAllPosts(): BlogPost[] {
  return blogs as BlogPost[];
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return (blogs as BlogPost[]).find((post) => post.slug === slug);
}
