'use client';

/**
 * StructuredData Component
 * Renders JSON-LD structured data in a script tag
 * Must be used in a client component since we're rendering dangerouslySetInnerHTML
 */
interface StructuredDataProps {
  schema: Record<string, any> | Record<string, any>[];
}

export function StructuredData({ schema }: StructuredDataProps) {
  const isArray = Array.isArray(schema);
  const data = isArray ? schema : [schema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
      suppressHydrationWarning
    />
  );
}
