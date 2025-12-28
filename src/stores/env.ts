import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";

export const useEnv = defineStore("env", {
    state: () => ({
        name: "Roy-Jin.",
        title: [
            "Roy-Jin",
            "MyIndex",
        ],
        avatar: [
            "/avatar.png",
            "/avatar-nobg.png",
        ],
        social: [
            {
                name: "GitHub",
                color: "var(--text-color)",
                icon: "github",
                href: "https://github.com/Roy-Jin",
            },
            {
                name: "Email",
                color: "#ee7a5a",
                icon: "envelope",
                href: "mailto:JinRoy@outlook.com",
            },
            {
                name: "QQ",
                color: "#12b7f5",
                icon: "qq",
                href: "https://qm.qq.com/q/2Qaj5mB6Jq",
            },
            {
                name: "Bilibili",
                color: "#fc8bab",
                icon: "bilibili",
                href: "https://space.bilibili.com/3461572714302163",
            },
        ],
        sayings: {
            apis: [
                {
                    enable: true,
                    name: "xxapi/dujitang",
                    url: "https://v2.xxapi.cn/api/dujitang",
                    format: async (data: any) => {
                        data = await data.json();
                        return { text: data.data, from: "sayings.from.funny" };
                    },
                },
                {
                    enable: true,
                    name: "hitokoto",
                    url: "https://v1.hitokoto.cn/",
                    format: async (data: any) => {
                        data = await data.json();
                        return { text: await data.hitokoto, from: data.from };
                    },
                },
                {
                    enable: true,
                    name: "jkapi/one_yan",
                    url: "https://jkapi.com/api/one_yan",
                    format: async (data: any) => {
                        return {
                            text: await data.text(),
                            from: "sayings.from.one_yan",
                        };
                    },
                },
                {
                    enable: true,
                    name: "jkapi/dujitang",
                    url: "https://jkapi.com/api/dujitang",
                    format: async (data: any) => {
                        return {
                            text: await data.text(),
                            from: "sayings.from.funny",
                        };
                    },
                },
                {
                    enable: true,
                    name: "uselessfacts",
                    url: "https://uselessfacts.jsph.pl/api/v2/facts/random",
                    format: async (data: any) => {
                        data = await data.json();
                        return {
                            text: data.text,
                            from: "sayings.from.facts",
                        }
                    }
                }
            ],
            upd_freq: (1000 * 60) * 1, // 1 minutes
        },
        gh_repos: {
            user: "Roy-Jin",
            show_count: 4,
            api: "https://api.github.com/users/{0}/repos?per_page=10",
            upd_freq: (1000 * 60) * 10, // 10 minutes
        },
        music: {
            apis: [
                "https://api.i-meto.com/meting/api",
                "https://api.injahow.cn/meting/",
            ],
            server: "netease",
            type: "playlist",
            id: "7697114803",
            upd_freq: (1000 * 60) * 10, // 10 minutes
        },
        copyright: "Copyright © 2024 - 2026 Roy-Jin",
    }),

    getters: {},

    actions: {},
});
