type PseoJsonLdProps = {
  schema: Record<string, unknown>;
};

export function PseoJsonLd({ schema }: PseoJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
