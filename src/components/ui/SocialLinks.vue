<template>
    <div class="social-links">
        <div v-for="link in links" :key="link.name" @click="handleClick(link.href)"
            class="link cursor-target">
            <Icon :icon="link.icon" :fill="link.color" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue';
const Icon = defineAsyncComponent(() => import('../Icon.vue'));

interface SocialLink {
    name: string;
    color: string;
    icon: string;
    href: string;
}

const props = defineProps<{
    links: SocialLink[];
}>();

const emit = defineEmits<{
    click: [url: string];
}>();

const handleClick = (url: string) => {
    emit('click', url);
};
</script>

<style scoped>
.social-links {
    gap: 1rem;
    padding: .5rem;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}

.link {
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
</style>
