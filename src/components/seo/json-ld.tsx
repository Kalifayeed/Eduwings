/**
 * Serialises a JSON-LD document into the page.
 *
 * `</script>` inside a string literal would terminate the tag early, so the
 * closing angle bracket is escaped. React does not escape `<script>` contents.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export { JsonLd };
