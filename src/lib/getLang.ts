import { cookies } from "next/headers";
import { translations, type Lang, type TranslationKey } from "@/lib/i18n";

const STORAGE_KEY = "lang";

export async function getLang(): Promise<{
  lang: Lang;
  t: (key: TranslationKey) => string;
}> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(STORAGE_KEY)?.value;
  const lang: Lang = stored === "ne" ? "ne" : "en";

  return { lang, t: (key: TranslationKey) => translations[lang][key] };
}
