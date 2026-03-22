/**
 * Reusable JSON-LD component. Accepts a schema (or array of schemas) and
 * renders <script type="application/ld+json"> tag(s). No third-party libs.
 */

export type JsonLdSchema = Record<string, unknown>;

interface JsonLdProps {
  schema: JsonLdSchema | JsonLdSchema[];
}

export function JsonLd({ schema }: JsonLdProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
