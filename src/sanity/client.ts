import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

if (process.env.NODE_ENV === "production" && (!projectId || !dataset)) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are required in production",
  );
}

export const client = createClient({
  projectId: projectId || "abc12345",
  dataset: dataset || "production",
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);
