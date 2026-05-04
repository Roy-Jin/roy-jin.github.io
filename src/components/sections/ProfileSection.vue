<template>
    <div class="profile-section">
        <div class="base">
            <Avatar :avatar="avatar" :avatar-video="avatar_video" />
            <h4 class="name">{{ name }}</h4>
            <div class="subtitle">{{ subtitle }}</div>
        </div>
        <Quote :quote="quote" />
        <SocialLinks :links="socialLinks" @click="handleLinkClick" />
    </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import Avatar from '../ui/Avatar.vue';
import Quote from '../ui/Quote.vue';
import SocialLinks from '../ui/SocialLinks.vue';

interface SocialLink {
    name: string;
    color: string;
    icon: string;
    href: string;
}

const props = defineProps<{
    name: string;
    subtitle: string;
    avatar: string;
    avatar_video?: string;
    quote: string;
    socialLinks: SocialLink[];
}>();

const emit = defineEmits<{
    'link-click': [url: string];
}>();

const handleLinkClick = (url: string) => {
    emit('link-click', url);
};
</script>

<style scoped>
.profile-section {
    gap: 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.base {
    padding: 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: var(--border-radius);
    background: radial-gradient(ellipse at 50% 80%, var(--theme-color), transparent);
}

.name {
    font-size: 2rem;
    text-align: center;
    font-weight: normal;
    font-family: "Playball";
}

.subtitle {
    font-family: "Playball", "仓耳逍遥行书";
}
</style>
