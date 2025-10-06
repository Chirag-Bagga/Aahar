import React from "react";
import { translateText } from "./translationService";

type LanguageName =
  | "English"
  | "Hindi"
  | "Punjabi"
  | "Tamil"
  | "Bengali"
  | "Chinese"
  | "Turkish"
  | "Hebrew";

const languages: { name: LanguageName }[] = [
  { name: "English" },
  { name: "Hindi" },
  { name: "Punjabi" },
  { name: "Tamil" },
  { name: "Bengali" },
  { name: "Chinese" },
  { name: "Turkish" },
  { name: "Hebrew" },
];

// Only let <br> through; escape everything else.
function escapeHtmlExceptBrPlaceholders(s: string): string {
  // escape all HTML chars first
  let out = s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  // restore placeholders as <br/>
  out = out.replaceAll("[[BR]]", "<br/>");
  return out;
}

async function translatePage(targetLang: LanguageName, controller: AbortController) {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-translate]"));

  // Prepare each element once
  for (const el of nodes) {
    const originalHtml: string = el.dataset.originalHtml ?? el.innerHTML; // now string
    if (!el.dataset.originalHtml) el.dataset.originalHtml = originalHtml;

    // store a "prepared" version (with <br> -> placeholder) per element
    const prepared: string = originalHtml.replace(/<br\s*\/?>/gi, "[[BR]]");
    el.dataset.preparedHtml = prepared;
  }

  // If English, simply restore and exit
  if (targetLang === "English") {
    for (const el of nodes) {
      el.innerHTML = el.dataset.originalHtml ?? el.innerHTML;
    }
    return;
  }

  // Deduplicate prepared texts
  const uniqueTexts = Array.from(
    new Set(nodes.map(el => el.dataset.preparedHtml ?? "")) // always a string
  ).filter(t => t.length > 0);

  const translationMap = new Map<string, string>();

  // Translate each unique text once
  await Promise.all(
    uniqueTexts.map(async (text) => {
      try {
        const translated = await translateText(text, "English", targetLang, {
          signal: controller.signal,
        });
        translationMap.set(text, translated);
      } catch {
        translationMap.set(text, text); // fallback to original prepared text
      }
    })
  );

  // Apply translations back to elements
  for (const el of nodes) {
    const prepared = el.dataset.preparedHtml ?? "";           // string
    const translatedRaw = translationMap.get(prepared) ?? prepared; // string
    const safeHtml = escapeHtmlExceptBrPlaceholders(translatedRaw); // expects string
    el.innerHTML = safeHtml;
  }
}

const LanguageSwitcher: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value as LanguageName;

    // cancel any in-flight job
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      await translatePage(selectedLang, abortRef.current);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="language-switcher" data-translate="message">
      <select onChange={handleLanguageChange} disabled={loading} aria-label="Choose language">
        {languages.map((lang) => (
          <option key={lang.name} value={lang.name}>
            {lang.name}
          </option>
        ))}
      </select>
      {loading && <span className="language-switcher__status">Translating…</span>}
    </div>
  );
};

export default LanguageSwitcher;
