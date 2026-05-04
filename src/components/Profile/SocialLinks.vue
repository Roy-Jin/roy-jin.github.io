<template>
    <div class="social-links">
        <div v-for="link in socialLinks" :key="link.name" @click="handleClick(link.href)"
            :style="{ '--link-color': link.color }" class="link cursor-target">
            <Icon :icon="link.icon" :fill="link.color" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, computed } from 'vue';
import { useEnv } from '@/stores/env';
const Icon = defineAsyncComponent(() => import('../Icon.vue'));
import { useI18n } from 'vue-i18n';
import { showConfirmDialog } from 'vant';
import 'vant/es/dialog/style';

const { t } = useI18n();
const env = useEnv();

const socialLinks = computed(() => {
    return env.social.map(link => {
        if (!link.color || !link.icon || !link.href || !link.name) {
            console.warn(`Invalid social link: ${JSON.stringify(link)}. Missing required properties.`);
            return null;
        }
        return link;
    }).filter(link => link !== null);
});

const handleClick = (url: string) => {
    showConfirmDialog({
        title: t('tips.openLink.title'),
        message: `${t('tips.openLink.message')}\n\n${url}`,
        cancelButtonColor: 'color-mix(in srgb, grey 60%, transparent)',
        confirmButtonColor: 'var(--theme-color)',
        closeOnClickOverlay: true
    }).then(() => {
        window.open(url, '_blank');
    }).catch(() => { });
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
    background-color: color-mix(in srgb, var(--link-color) 20%, transparent);
    color: color-mix(in srgb, var(--theme-color) 85%, transparent);
}
</style>
