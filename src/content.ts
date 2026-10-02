// Some models (e.g. zai-glm-*) return message.content as an array of chunks
// ({type:'thinking'|'text', ...}) instead of a string. The chatgpt client
// expects a string, so flatten to the concatenated 'text' chunks.
export function flattenContent(content: unknown): unknown {
  if (!Array.isArray(content)) return content
  return content
    .filter(
      (c: any) => c != null && c.type === 'text' && typeof c.text === 'string'
    )
    .map((c: any) => c.text)
    .join('')
}
