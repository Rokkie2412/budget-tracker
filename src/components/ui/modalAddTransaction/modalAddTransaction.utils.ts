import { EXPENSE_KEYWORD_MAP, INCOME_KEYWORD_MAP } from "@/constants";

export const predictCategory = (description: string, type: "OUT" | "IN"): string | null => {
  const normalized = description
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?[\]]/g, " ")
    .trim();

  if (!normalized) return null;

  const keywordMap = type === "IN" ? INCOME_KEYWORD_MAP : EXPENSE_KEYWORD_MAP;
  const words = normalized.split(/\s+/).filter(Boolean);

  let bestMatch: { category: string; length: number; isExact: boolean } | null = null;

  for (const [category, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase().trim();
      const keywordWords = lowerKeyword.split(/\s+/).filter(Boolean);

      // 1. Exact full match
      if (normalized === lowerKeyword) {
        return category;
      }

      // 2. Multi-word phrase matching
      if (keywordWords.length > 1) {
        if (normalized.includes(lowerKeyword)) {
          if (!bestMatch || lowerKeyword.length > bestMatch.length) {
            bestMatch = { category, length: lowerKeyword.length, isExact: true };
          }
        }
      } else {
        // 3. Single-word token exact match
        if (words.includes(lowerKeyword)) {
          if (!bestMatch || lowerKeyword.length > bestMatch.length) {
            bestMatch = { category, length: lowerKeyword.length, isExact: false };
          }
        }
      }
    }
  }

  return bestMatch ? bestMatch.category : null;
};
