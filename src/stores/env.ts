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
                icon: "fa-brands fa-github",
                href: "https://github.com/Roy-Jin",
            },
            {
                name: "Email",
                color: "#ee7a5a",
                icon: "fa-solid fa-envelope",
                href: "mailto:JinRoy@outlook.com",
            },
            {
                name: "QQ",
                color: "#12b7f5",
                icon: "fa-brands fa-qq",
                href: "https://qm.qq.com/q/2Qaj5mB6Jq",
            },
            {
                name: "Bilibili",
                color: "#fc8bab",
                icon: "fa-brands fa-bilibili",
                href: "https://space.bilibili.com/3461572714302163",
            },
        ],
        github_repos: {
            name: "Roy-Jin",
            show_count: 4,
            api: "https://api.github.com/users/%name%/repos?per_page=10",
        },
        copyright: "Copyright © 2024 - 2026 Roy-Jin",
        music: {
            api: "https://api.injahow.cn/meting/",
            server: "netease",
            type: "playlist",
            id: "7697114803",
        },
    }),

    getters: {},

    actions: {},
});
