import { defineStore } from "pinia";
import { setI18nLanguage } from "@/i18n";

export const useGlobal = defineStore("global", {
  state: () => ({
    lang: "zh" as string,
    theme: "light" as "light" | "dark",
    sayings: {
      text: "" as string,
      from: "" as string,
    },
    repos: [] as any[],
    repos_upd: 0 as number,
    music: {
      dataUpd: 0 as number,
      data: [] as {
        url: string;
        name: string;
        artist: string;
        pic: string;
        lrc: string;
      }[],
      artist: "" as string,
      lrc: "" as string,
      name: "" as string,
      pic: "" as string,
      url: "" as string,
      curLrc: "" as string,
      themeColor: "" as string,
      order: "loop" as string,
      audio: null as HTMLAudioElement | null,
      isPlaying: false as boolean,
    },
  }),

  getters: {
    getCurrentLanguage: (state) => state.lang,
    getCurrentTheme: (state) => state.theme,
  },

  actions: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", this.theme);
    },

    toggleLang(lang?: string) {
      this.lang = lang ? lang : this.lang === "zh" ? "en" : "zh";
      setI18nLanguage(this.lang);
    },

    initLang() {
      setI18nLanguage(this.lang);
    }
  },

  persist: {
    key: "myindex-global",
    storage: localStorage,
  },
});
