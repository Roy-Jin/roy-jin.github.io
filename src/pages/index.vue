<template>
    <Scrollable ref="scrollRef">
        <div class="wrapper">
            <div class="ForMe">
                <div class="base">
                    <svg id="avatar" width="100%" height="100%" viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <clipPath id="circleClip">
                                <circle cx="100" cy="100" r="100" />
                            </clipPath>
                        </defs>
                        <image x="0" y="0" width="100%" height="100%" clip-path="url(#circleClip)" id="avatarImage"
                            :xlink:href="env.avatar[0]" />
                    </svg>
                    <h4 id="name">{{ env.name }}</h4>
                    <div id="subtitle-text">{{ $t("subtitle") }}</div>
                </div>
                <div class="quote">
                    <Icon icon="quoteLeft" fill="var(--theme-color)" />
                    <p id="quote-text">{{ $t("quote") }}</p>
                </div>
                <div id="social">
                    <div v-for="link in socialLinks" :key="link.name" @click="openLink(link.href)" class="link"
                        :style="link.style">
                        <Icon :icon="link.icon" :fill="link.color" />
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="today">
                    <div id="date">
                        <p class="time">
                            <span class="num">{{ moment.num }}</span>
                            <span class="sub">{{ moment.sub }}</span>
                        </p>
                        <p class="day">{{ moment.day }}</p>
                    </div>
                    <hr>
                    <div id="sayings">
                        <p class="text">{{ sayings.text }}</p>
                        <p class="from">——《{{ sayings.from }}》</p>
                    </div>
                </div>
                <div id="projects">
                    <div v-for="repo in repos" @click="openLink(repo.html_url)" class="project"
                        :style="{ background: `color-mix(in srgb, ${repo.color ?? ''} 20%, transparent)` }">
                        <div class="text">{{ repo.name }}</div>
                    </div>
                </div>
            </div>
        </div>
    </Scrollable>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, inject, onMounted, onUnmounted, ref } from 'vue';
import Scrollable from '@/components/Scrollable.vue';
import dayjs from 'dayjs';
import { useI18n } from "vue-i18n";
import { useEnv } from '@/stores/env';
import { useGlobal } from '@/stores/global';
const Icon = defineAsyncComponent(() => import('@/components/Icon.vue'));

const scrollRef = ref<InstanceType<typeof Scrollable> | null>(null);

const { t } = useI18n();
const env = useEnv();
const global = useGlobal();

const modal = inject('modal') as {
    showToast: (options: any) => void
    hideToast: () => void
    showModal: (options: any) => void
    hideModal: () => void
}

const socialLinks = computed(() => {
    return env.social.map(link => {
        if (!link.color || !link.icon || !link.href || !link.name) {
            console.warn(`Invalid social link: ${JSON.stringify(link)}. Missing required properties.`);
            return null;
        }
        return {
            ...link,
            style: `background: color-mix(in srgb, ${link.color} 20%, transparent)`,
        };
    }).filter(link => link !== null);
});

const openLink = (path: string) => {
    modal.showModal({
        type: 'confirm',
        title: t('tips.openLink.title'),
        message: t('tips.openLink.message'),
        confirmText: t('modal.button.confirm'),
        cancelText: t('modal.button.cancel'),
        onConfirm: async () => {
            window.open(path, '_blank');
        },
        onCancel: () => { }
    })
}

const apis = [
    {
        enable: true,
        name: "xxapi/dujitang",
        url: "https://v2.xxapi.cn/api/dujitang",
        format: async (data: any) => {
            data = await data.json();
            return { text: data.data, from: t("sayings.from.funny") };
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
                from: t("sayings.from.one_yan"),
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
                from: t("sayings.from.funny"),
            };
        },
    },
];

const moment = ref({
    num: "00:00:00",
    sub: "AM",
    day: "Monday, 1 January."
})

const sayings = ref({
    text: t("tips.loading"),
    from: t("tips.loading")
})

const repos = ref(global.repos);

let updateMoment: any = () => updateMoment = setInterval(() => {
    const now = dayjs();
    moment.value = {
        num: now.format("hh:mm:ss"),
        sub: now.format("A"),
        day: now.format("dddd, D MMMM.")
    }
}, 1);

// 获取随机语录
const getSayings = async () => {
    const enabledAPIs = apis.filter(api => api.enable);
    if (enabledAPIs.length === 0) { return console.warn("[sayings] No available APIs.") };
    const randomAPI = enabledAPIs[Math.floor(Math.random() * enabledAPIs.length)];
    if (!randomAPI) return;

    const response = await fetch(randomAPI.url)
        .catch(e => { return { ok: false, error: e } });
    if (response.ok) {
        const formated = await randomAPI.format(response);
        sayings.value = {
            text: formated.text,
            from: formated.from
        }
        global.sayings = {
            text: formated.text,
            from: formated.from
        }
    } else {
        randomAPI.enable = false;
        if (apis.filter(api => api.enable).length === 0) {
            sayings.value = global.sayings;
        } else {
            return getSayings();
        }
    }
};

const getRepos = async () => {
    const url = env.github_repos.api.replace('%name%', env.github_repos.name)
    const rep =
        await fetch(url)
            .then(response => response.json())
            .then(data =>
                data
                    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
                    .splice(0, env.github_repos.show_count)
            );
    if (!rep) return console.warn("[repos] Failed to fetch data.");
    repos.value = rep;
    global.repos = rep;
}

onMounted(async () => {
    updateMoment();
    await getSayings();
    await getRepos();
    scrollRef.value?.refresh();
    scrollRef.value?.scrollTo(0, 0)
})

onUnmounted(() => {
    clearInterval(updateMoment);
})
</script>

<style scoped>
.wrapper {
    gap: 2rem;
    width: 100%;
    height: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}

.ForMe {
    gap: 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.ForMe>.base {
    padding: 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: var(--border-radius);
    background: radial-gradient(ellipse at 50% 80%, var(--theme-color), transparent);
}

.ForMe #avatar {
    max-width: 66%;
}

.ForMe #name {
    font-size: 2rem;
    text-align: center;
    font-weight: normal;
    font-family: "Playball";
}

.ForMe>#social {
    gap: 1rem;
    padding: .5rem;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}

.ForMe>#social>.link {
    height: 48px;
    width: 48px;
    padding: 8px;
    display: flex;
    border-radius: 10px;
    align-items: center;
    text-decoration: none;
    justify-content: center;
    background-color: var(--theme-color-light);
    color: color-mix(in srgb, var(--theme-color) 85%, transparent);
}

@font-face {
    font-family: "仓耳逍遥行书";
    src: url("@/assets/fonts/仓耳逍遥行书.ttf");
}

.ForMe>.quote {
    width: 95%;
    padding: .5rem;
    display: flex;
    max-width: 500px;
    border-radius: 10px;
    flex-direction: row;
    font-family: "仓耳逍遥行书", "Playball";
    background: linear-gradient(to right bottom, var(--theme-color-light), transparent);
}

.quote>svg {
    width: 1.5rem;
    color: var(--theme-color);
    margin-right: 1rem;
}

.quote>#quote-text {
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
}

.wrapper>.content {
    gap: 1rem;
    display: flex;
    max-width: 500px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.today {
    width: 100%;
    padding: 1rem;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: radial-gradient(ellipse at 33% 25%, var(--theme-color), transparent)
}

#date>.time {
    font-size: 50px;
    font-weight: 600;
}

.time>.num {
    font-family: sans-serif;
}

.time>.sub {
    font-size: 15px;
}

#date>.day {
    font-size: 18px;
    font-weight: 500;
}

.today>hr {
    width: 100%;
    height: 1px;
    border: none;
    margin: 1rem auto;
    background: linear-gradient(to right, var(--theme-color), transparent 64%);
}

.today>#sayings {
    font-family: "仓耳渔阳体";
}

#sayings>.text {
    font-weight: bold;
}

#sayings>.from {
    white-space: nowrap;
    opacity: 0.648;
    float: right;
    font-size: 64.8%;
}

.content>#projects {
    gap: .5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.content>#projects>.project {
    width: 100%;
    padding: 1rem;
    display: flex;
    border-radius: 10px;
    text-decoration: none;
    color: var(--text-color);
    font-family: "Electrolize", sans-serif;
    border-left: 4px solid var(--theme-color);
    background-color: var(--theme-color-light);
}


/* 当屏幕宽度小于等于 768px 时，应用以下样式调整 */
@media screen and (max-width: 768px) {
    .wrapper {
        flex-direction: column;
        height: unset;
    }

    .ForMe {
        margin-top: 1rem;
    }

    #social {
        width: 100%;
    }

    .content {
        width: 80%;
        margin-bottom: 1rem;
    }

    #date>.time {
        font-size: 40px;
    }
}
</style>
