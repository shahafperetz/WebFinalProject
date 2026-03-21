export const buildPostSearchPrompt = (query: string) => `
You are helping a social content app.

Your job is to convert a user's natural-language search into structured JSON.

Return ONLY valid JSON in this exact format:
{
  "keywords": string[],
  "category": string | null,
  "sentiment": "positive" | "negative" | "neutral" | null
}

Rules:
- Extract ONLY meaningful keywords (nouns, topics, entities)
- DO NOT include stop words like: to, the, is, a, of, and, in, on, for
- Each keyword must be useful for searching content
- Maximum 5 keywords
- category should be short if relevant
- sentiment only if clearly implied
- Return JSON only (no explanation)

User query:
${JSON.stringify(query)}
`;