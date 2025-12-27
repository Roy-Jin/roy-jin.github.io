<template>
    <div v-if="isOpen" class="menu-overlay" @click.self="closeMenu">
    </div>
    <div class="menu" :class="{ 'open': isOpen }" :style="{
        top: `${top}px`,
        height: `calc(100% - ${top}px)`
    }">
        <Scrollable class="content-wrapper">
            <div class="content">
                <div class="title">
                    <span>{{ useEnv().title[0] }}</span>/
                    <span>{{ useEnv().title[1] }}</span>
                </div>
                <MusicPlayer />
                <hr>
                <div class="switcher" @click="toggleTheme">
                    <div class="icon">
                        <Sun v-if="global.theme === 'light'" />
                        <Moon v-else />
                    </div>
                    <div>
                        {{ global.theme === 'light' ? $t("theme.light") : $t("theme.dark") }}
                    </div>
                </div>
                <div class="switcher" @click="toggleLang">
                    <div class="icon">
                        <Languages />
                    </div>
                    <div>
                        {{ $t("lang.name") + "：" + $t(`lang.${global.lang}`) }}
                    </div>
                </div>
                <hr>
                <div class="footer">{{ useEnv().copyright }}</div>
            </div>
        </Scrollable>
    </div>
</template>

<script setup lang='ts'>
import { useEnv } from '@/stores/env';
import { useGlobal } from '@/stores/global';
import { defineAsyncComponent, ref } from 'vue';
import { Sun, Moon, Languages } from 'lucide-vue-next';
import Scrollable from './Scrollable.vue';

const props = defineProps<{
    top: number
}>();

const MusicPlayer = defineAsyncComponent(() => import('@/components/MusicPlayer.vue'));

const isOpen = ref(false);
const global = useGlobal();

const toggleTheme = () => {
    global.toggleTheme();
};

const toggleLang = () => {
    global.toggleLang();
}
const closeMenu = () => {
    isOpen.value = false;
}

defineExpose({
    toggle: () => {
        isOpen.value = !isOpen.value;
    },
    isOpen: isOpen,
})
</script>

<style scoped>
.menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 76;
    background: transparent;
}

.menu {
    width: 100%;
    max-width: 768px;
    overflow: hidden;
    position: fixed;
    backdrop-filter: blur(30px);
    right: 0;
    transition: var(--transition);
    transform: translateX(100%);
    pointer-events: none;
    z-index: 77;
    display: flex;
    flex-direction: column;
    justify-content: safe center;
    align-items: center;
    background: var(--theme-color-light);
}

.menu.open {
    pointer-events: all;
    transform: translateX(0);
}

.content {
    gap: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;

    .title {
        margin: 3rem 0 3rem 0;
        font-weight: 900;
        font-size: xx-large;
        text-shadow: 0 0 10px var(--main-bg);
        opacity: 0.86;

        * {
            margin: 0 .5rem;
        }
    }

    hr {
        width: 86%;
        height: 2px;
        border: none;
        background: linear-gradient(to right, transparent, var(--theme-color), transparent);
    }

    .switcher {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: .5rem;
        border-radius: var(--border-radius);
        background: var(--theme-color-light);
        transition: var(--transition);
        border: 1px solid var(--theme-color);
        width: 80%;
        max-width: 300px;

        .icon {
            width: 3rem;
            font-size: 2.5rem;
            text-align: center;
            color: var(--theme-color);
        }

        div:last-child {
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--text-color);
            font-family: "仓耳渔阳体";
        }
    }

    .footer {
        font-size: small;
        margin: 3rem 0;
        color: var(--text-color);
    }
}
</style>