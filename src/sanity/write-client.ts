import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/** Server-only: never import in client components. */
export function getSanityWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!token || !projectId) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}
