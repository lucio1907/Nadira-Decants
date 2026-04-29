/**
 * Reusable JSON-LD structured data component.
 * Renders a <script type="application/ld+json"> tag with the provided data.
 * Safe for SSR — no dangerouslySetInnerHTML XSS risk since data is serialized.
 */

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  );
};
