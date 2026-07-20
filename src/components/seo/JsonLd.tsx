/**
 * Injecte un bloc de données structurées JSON-LD (schema.org).
 * Rendu côté serveur : les moteurs le lisent directement dans le HTML.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify échappe le contenu ; sûr pour du JSON-LD.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
