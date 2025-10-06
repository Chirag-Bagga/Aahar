// src/translationService.ts
// Centralised translation helper with caching, TTL and env-driven URL.

export type TranslateResponse = { answer?: string } & Record<string, unknown>;

// Use Vite env for flexibility
const API_URL =
  import.meta.env.VITE_TRANSLATE_URL ??
  "http://localhost:8000/translate/";

// LocalStorage cache (with TTL to avoid growing forever)
const STORAGE_KEY = "aahar.translationCache.v1";
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type CacheValue = { v: string; // value
  t: number; // timestamp
  ttl: number; // ttl in ms
};

type CacheDict = Record<string, CacheValue>;

function getCache(): CacheDict {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CacheDict;
    // drop expired
    const now = Date.now();
    for (const k of Object.keys(parsed)) {
    const entry = parsed[k];            // entry: CacheValue | undefined
    if (!entry) {                       // narrow: now entry is CacheValue
        delete parsed[k];
        continue;
  }
  if (now - entry.t > entry.ttl) {
    delete parsed[k];
  }
}
    return parsed;
  } catch {
    return {};
  }
}

function setCache(dict: CacheDict) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dict));
  } catch {
    // ignore storage errors (quota, privacy mode)
  }
}

function makeKey(text: string, srcLang: string, tgtLang: string) {
  return `${srcLang}__${tgtLang}__${text}`;
}

export async function translateText(
  text: string,
  srcLang: string,
  tgtLang: string,
  opts?: { signal?: AbortSignal; ttlMs?: number }
): Promise<string> {
  const ttl = opts?.ttlMs ?? DEFAULT_TTL_MS;
  const key = makeKey(text, srcLang, tgtLang);
  const cache = getCache();

  const cached = cache[key];
  if (cached) return cached.v;

  // Build payload expected by your backend
  const payload = {
    question: text, // <-- your API naming
    answer: tgtLang // <-- target language
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: opts?.signal
  });

  if (!res.ok) {
    throw new Error(`Translate failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as TranslateResponse;

  // Your API returns { answer: "<translated text>" }
  const translated = typeof data.answer === "string" ? data.answer : text;

  cache[key] = { v: translated, t: Date.now(), ttl };
  setCache(cache);
  return translated;
}
