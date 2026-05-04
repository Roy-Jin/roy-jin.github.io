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
                    <span>{{ useEnv().title[1] }}</span>
                </div>
                <MusicPlayer class="cursor-target" />
                <hr>
                <div class="switcher-container">
                    <div class="switcher cursor-target" :class="{ 'active': themeAnimating }" @click="toggleTheme">
                        <div class="icon-wrapper">
                            <div class="icon-circle">
                                <Sun v-if="global.theme === 'light'" class="theme-icon" />
                                <Moon v-else class="theme-icon" />
                            </div>
                        </div>
                        <div class="switcher-text">
                            <span class="label">{{ $t("theme.name") }}</span>
                            <span class="value">{{ global.theme === 'light' ? $t("theme.light") : $t("theme.dark") }}</span>
                        </div>
                        <div class="arrow">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </div>
                    <div class="switcher cursor-target" :class="{ 'active': langAnimating }" @click="toggleLang">
                        <div class="icon-wrapper">
                            <div class="icon-circle">
                                <Languages class="lang-icon" />
                            </div>
                        </div>
                        <div class="switcher-text">
                            <span class="label">{{ $t("lang.name") }}</span>
                            <span class="value">{{ $t(`lang.${global.lang}`) }}</span>
                        </div>
                        <div class="arrow">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
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
import { ref } from 'vue';
import { Sun, Moon, Languages } from 'lucide-vue-next';
import Scrollable from './Scrollable.vue';
import MusicPlayer from '@/components/MusicPlayer.vue';

const props = defineProps<{
    top: number
}>();

const isOpen = ref(false);
const global = useGlobal();
const themeAnimating = ref(false);
const langAnimating = ref(false);

const toggleTheme = (event: MouseEvent) => {
    themeAnimating.value = true;
    global.toggleTheme({ clientX: event.clientX, clientY: event.clientY });
    setTimeout(() => {
        themeAnimating.value = false;
    }, 400);
};

const toggleLang = () => {
    langAnimating.value = true;
    global.toggleLang();
    setTimeout(() => {
        langAnimating.value = false;
    }, 400);
};

const closeMenu = () => {
    isOpen.value = false;
};

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
    backdrop-filter: var(--filter-blur);
    right: 0;
    transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
    transform: translateX(100%);
    opacity: 0;
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
    opacity: 1;
}

.content {
    gap: 1.5rem;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 1rem;

    .title {
        font-family: "仓耳逍遥行书";
        margin: 2rem 0 1.5rem 0;
        font-weight: 900;
        font-size: 2.5rem;
        text-shadow: 0 0 10px var(--main-bg);
        opacity: 0.86;
        animation: fadeInUp 0.5s ease;

        * {
            margin: 0 .5rem;
        }
    }

    hr {
        width: 90%;
        height: 2px;
        border: none;
        background: linear-gradient(to right, transparent, var(--theme-color), transparent);
    }

    .switcher-container {
        width: 100%;
        max-width: 380px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .switcher {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.25rem;
        border-radius: 16px;
        background: var(--theme-color-light);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        border: 2px solid transparent;
        width: 100%;
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--theme-color) 10%, transparent), transparent);
            transition: left 0.6s ease;
        }

        &:hover {
            border-color: var(--theme-color);
            box-shadow: 0 8px 24px color-mix(in srgb, var(--theme-color) 20%, transparent);

            &::before {
                left: 100%;
            }

            .arrow {
                transform: translateX(4px);
            }

            .icon-circle {
                transform: scale(1.1) rotate(10deg);
            }
        }

        &:active {
            transform: scale(0.98);
        }

        &.active {
            .icon-circle {
                animation: pulse 0.4s ease;
            }

            .theme-icon,
            .lang-icon {
                animation: rotateIn 0.4s ease;
            }
        }

        .icon-wrapper {
            flex-shrink: 0;
        }

        .icon-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: color-mix(in srgb, var(--theme-color) 15%, transparent);
            transition: all 0.3s ease;

            .theme-icon,
            .lang-icon {
                width: 26px;
                height: 26px;
                color: var(--theme-color);
            }
        }

        .switcher-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            .label {
                font-size: 0.85rem;
                opacity: 0.7;
                font-family: "Playball";
            }

            .value {
                font-size: 1.2rem;
                font-weight: bold;
                color: var(--text-color);
                font-family: "仓耳渔阳体";
            }
        }

        .arrow {
            flex-shrink: 0;
            color: var(--theme-color);
            opacity: 0.6;
            transition: all 0.3s ease;
        }
    }

    .footer {
        font-size: small;
        margin: 2rem 0 1rem 0;
        color: var(--text-color);
        opacity: 0.7;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 0.86;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.15);
    }
}

@keyframes rotateIn {
    from {
        transform: rotate(-180deg) scale(0.5);
        opacity: 0;
    }
    to {
        transform: rotate(0deg) scale(1);
        opacity: 1;
    }
}

@media screen and (max-width: 768px) {
    .content {
        padding: 0.75rem;
        gap: 1.25rem;

        .title {
            font-size: 2rem;
            margin: 1.5rem 0 1rem 0;
        }

        .switcher {
            padding: 0.85rem 1rem;
            gap: 0.85rem;

            .icon-circle {
                width: 42px;
                height: 42px;

                .theme-icon,
                .lang-icon {
                    width: 22px;
                    height: 22px;
                }
            }

            .switcher-text {
                .value {
                    font-size: 1.05rem;
                }
            }
        }
    }
}
</style>