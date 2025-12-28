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
    gh_repos: [] as {
      name: string;
      html_url: string;
      description: string;
      [key: string]: unknown;
    }[],
    music: {
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
    updated_at: {
      music: 0 as number,
      sayings: 0 as number,
      gh_repos: 0 as number,
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
    },

    async loadSayings(
      config: {
        apis: {
          url: string;
          enable: boolean;
          name: string;
          format: (response: any) => Promise<{ text: string; from: string }>;
        }[];
        upd_freq: number;
      },
    ): Promise<void> {
      if (this.updated_at.sayings + config.upd_freq > Date.now()) return;
      let enabledAPIs = config.apis.filter((api) => api.enable);
      if (enabledAPIs.length === 0) {
        return console.warn("[sayings] No available APIs.");
      }
      while (enabledAPIs.length > 0) {
        const randomAPI =
          enabledAPIs[Math.floor(Math.random() * enabledAPIs.length)];
        if (!randomAPI) return;

        const response = await fetch(randomAPI.url).catch((e) => {
          return { ok: false, error: e };
        });
        if (response.ok) {
          const formated = await randomAPI.format(response);
          this.sayings = {
            text: formated.text,
            from: formated.from,
          };
          break;
        } else {
          enabledAPIs = enabledAPIs.filter((api) =>
            api.name !== randomAPI.name
          );
        }
      }
      this.updated_at.sayings = Date.now();
    },

    async loadGhRepos(config: {
      user: string;
      show_count: number;
      api: string;
      upd_freq: number;
    }): Promise<void> {
      if (this.updated_at.gh_repos + config.upd_freq > Date.now()) return;
      const url = config.api.replace("{0}", config.user);
      await fetch(url)
        .then((response) => response.json())
        .then((data) =>
          this.gh_repos = data
            .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
            .splice(0, config.show_count)
        );
      this.updated_at.gh_repos = Date.now();
    },

    async loadMusic(config: {
      apis: string[];
      server: string;
      type: string;
      id: string;
      upd_freq: number;
    }): Promise<void> {
      if (this.updated_at.music + config.upd_freq > Date.now()) return;
      const apis = config.apis;
      for (let i = 0; i < apis.length; i++) {
        const api = apis[i] as string;
        const api_url = new URL(api);
        api_url.searchParams.set("server", config.server);
        api_url.searchParams.set("type", config.type);
        api_url.searchParams.set("id", config.id);
        const response = await fetch(api_url.href);
        if (!response.ok) continue;
        const data = await response.json() as any[];
        this.music.data = data.reverse().map((song: any) => {
          return {
            url: song.url,
            name: song.name || song.title,
            artist: song.artist || song.author,
            pic: song.pic,
            lrc: song.lrc,
          };
        });
        break;
      }
      this.updated_at.music = Date.now();
    },
  },

  persist: {
    key: "myindex-global",
    storage: localStorage,
  },
});
