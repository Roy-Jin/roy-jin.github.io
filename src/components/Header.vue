<template>
    <div class="header" ref="headerRef" v-if="isShow">
        <div class="title">
            <img :src="envInfo.logo" alt="logo">
            <h2>{{ envInfo.title[0] }}<span class="subtitle">{{ envInfo.title[1] }}</span></h2>
        </div>
        <div id="menu-btn" :class="'fa-solid fa-' + (menuRef?.isOpen ? 'times' : 'bars')" ref="menuBtnRef"
            @click="toggleMenu"></div>
    </div>
    <Menu ref="menuRef" :top="height" />
</template>

<script setup lang='ts'>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useEnv } from '@/stores/env';
import Menu from './Menu.vue';
const env = useEnv();

const headerRef = ref<HTMLDivElement | null>(null);
const menuRef = ref<InstanceType<typeof Menu> | null>(null);
const height = ref(0);
const isShow = ref(true);
let resizeObserver: ResizeObserver | null = null

const toggleMenu = () => {
    menuRef.value?.toggle()
}

const updateHeight = () => {
    if (headerRef.value) {
        height.value = headerRef.value.offsetHeight
    }
}

const envInfo = computed(() => {
    const title = env.title;
    return {
        logo: env.avatar[1],
        title: [title[0] + '|', title[1]]
    };
})

onUnmounted(() => {
    resizeObserver?.disconnect()
})

onMounted(async () => {
    await nextTick()
    updateHeight()

    if (headerRef.value) {
        resizeObserver = new ResizeObserver(() => {
            updateHeight()
        })
        resizeObserver.observe(headerRef.value)
    }
})

defineExpose({
    height,
    show: () => {
        isShow.value = true;
    },
    hide: () => {
        isShow.value = false;
    }
})
</script>

<style scoped>
.header {
    width: 100%;
    position: fixed;
    display: flex;
    padding: 0.5rem 6%;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(20px);
    background: var(--theme-color-light);
    z-index: 88;
}

.header>.title {
    width: 100%;
    display: flex;
    align-items: end;
    font-size: x-large;
    flex-direction: row;
}

.header>.title>img {
    width: 4rem;
    height: 4rem;
    margin-right: 0.5rem;
}

.header .subtitle {
    font-size: 60%;
    opacity: 0.6;
}

#menu-btn {
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--theme-color);
    font-size: 200%;
}

#toggle-menu {
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
    position: fixed;
    backdrop-filter: blur(0px);
    border-radius: 50rem;
    top: 50%;
    right: 50%;
    transition: var(--transition);
    transform: translate(100%, -100%) scale(0);
    pointer-events: none;
    z-index: 77;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#toggle-menu[data-open] {
    pointer-events: all;
    border-radius: 0rem;
    top: 50%;
    right: 50%;
    backdrop-filter: blur(50px);
    transform: translate(50%, -50%) scale(1);
}

#toggle-menu>.link {
    width: 80%;
    max-width: 600px;
    margin: 0.5rem;
    font-size: x-large;
    text-align: center;
    border-bottom: 5px solid var(--theme-color);
    background: var(--theme-color-light);
    backdrop-filter: blur(20px);
    border-radius: 10px;
    transition: all 0.2s ease-in-out;
    transform: scale(1);
    font-weight: 900;
    padding: 0.5rem 1rem;
    opacity: 0.86;
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

#toggle-menu>.link[data-active] {
    background: var(--theme-color-dark);
    opacity: 1;
}

#toggle-menu>.link:active {
    transform: scale(0.86);
}

@media screen and (max-width: 768px) {
    .header>.title {
        font-size: unset;
    }

    .header>.title>img {
        width: 2rem;
        height: 2rem;
        margin-right: 0.5rem;
    }
}
</style>
