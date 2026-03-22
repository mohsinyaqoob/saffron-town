// src/components/seo/JsonLdSchema.tsx

interface JsonLdSchemaProps {
  schema: Record<string, unknown>;
}

/** Generic JSON-LD component for any schema (Article, FAQ, etc.) */
export function JsonLdSchema({ schema }: JsonLdSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
