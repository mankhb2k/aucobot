const EXTRACT_TEXT_MAX_CHARS = 80_000;

export async function extractDocumentText(input: {
  buffer: Buffer;
  mimeType: string;
}): Promise<string> {
  const mime = input.mimeType;

  if (mime === "text/plain" || mime === "text/markdown") {
    return truncate(input.buffer.toString("utf8"));
  }

  if (mime === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default as (
      data: Buffer,
    ) => Promise<{ text: string }>;
    const parsed = await pdfParse(input.buffer);
    return truncate(parsed.text ?? "");
  }

  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer: input.buffer });
    return truncate(result.value ?? "");
  }

  throw new Error(`Unsupported mime type for extract: ${mime}`);
}

function truncate(text: string): string {
  // Strip NUL bytes from extracted binary text (pdf/docx edge cases).
  // eslint-disable-next-line no-control-regex -- intentional null-byte scrub
  const normalized = text.replace(/\u0000/g, "").trim();
  if (normalized.length <= EXTRACT_TEXT_MAX_CHARS) return normalized;
  return `${normalized.slice(0, EXTRACT_TEXT_MAX_CHARS)}\n\n[…truncated]`;
}
