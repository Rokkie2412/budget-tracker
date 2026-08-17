import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { Language, TranslationKeys, translations } from "@/i18n/translations";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  loadLanguage: () => Promise<void>;
  t: (key: TranslationKeys) => string;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: "id",

  setLanguage: async (lang: Language): Promise<void> => {
    await SecureStore.setItemAsync("appLanguage", lang);
    set({ language: lang });
  },

  loadLanguage: async (): Promise<void> => {
    try {
      const savedLang = await SecureStore.getItemAsync("appLanguage");
      if (savedLang === "id" || savedLang === "en") {
        set({ language: savedLang });
      }
    } catch {
      set({ language: "id" });
    }
  },

  t: (key: TranslationKeys): string => {
    const currentLang = get().language;
    return translations[currentLang][key] || translations.id[key] || key;
  },
}));
