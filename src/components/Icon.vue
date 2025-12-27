<template>
    <component :is="_icon" />
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import qq from './Icons/qq.vue';
import github from './Icons/github.vue';
import bilibili from './Icons/bilibili.vue';
import envelope from './Icons/envelope.vue';
import quoteLeft from './Icons/quote-left.vue';

const props = defineProps<{
    icon: string,
    color?: string,
    size?: number,
}>();

const _icon = computed(() => {
    const iconMap = {
        qq,
        github,
        bilibili,
        envelope,
        quoteLeft
    };
    if (iconMap.hasOwnProperty(props.icon)) {
        return iconMap[props.icon as keyof typeof iconMap];
    } else {
        console.error(`Icon ${props.icon} not found`);
        return null;
    }
});
</script>