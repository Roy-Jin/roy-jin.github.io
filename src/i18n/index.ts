import { createI18n } from "vue-i18n";
import { Locale } from "vant";

import zh from "./locales/zh.json";
import en from "./locales/en.json";
import enUS from "vant/es/locale/lang/en-US";
import zhCN from "vant/es/locale/lang/zh-CN";

const i18n = createI18n({
  legacy: false,
  locale: "zh",
  fallbackLocale: "zh",
  messages: {
    zh,
    en,
  },
});

export function setI18nLanguage(lang: string) {
  i18n.global.locale.value = lang as any;
  Locale.use(lang, lang === "zh" ? zhCN : enUS);
}

export default i18n;
