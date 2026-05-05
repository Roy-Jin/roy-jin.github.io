<template>
    <Popup v-model:show="show" round position="bottom" :teleport="'body'" :style="{ height: '90%', overflow: 'hidden' }"
        :lazy-render="false" :lock-scroll="false" :closeable="true">
        <Scrollable ref="scrollableRef" :options="{ scrollbar: true }">
            <div class="popup-content">
                <h2 class="popup-title">{{ t('projects.title') }}</h2>
                <div class="repos-grid">
                    <Repo v-for="repo in repos" :key="repo.html_url" :repo="repo" class="repo-item" />
                </div>
            </div>
        </Scrollable>
    </Popup>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Popup } from 'vant';
import 'vant/es/popup/style';
import Scrollable from '@/components/Scrollable.vue';
import { Repo } from '@/components/Projects';

interface Repo {
    name: string;
    html_url: string;
    description: string | null;
    stargazers_count?: number;
    forks_count?: number;
    watchers_count?: number;
    language?: string | null;
    pushed_at?: string;
    color?: string;
}

const props = defineProps<{
    repos: Repo[];
}>();

const { t } = useI18n();
const show = ref(false);
const scrollableRef = ref<typeof Scrollable | null>(null);

watch(() => show.value, (newVal) => {
    if (newVal) {
        setTimeout(scrollableRef?.value?.refresh, 0);
    }
});

const showPopup = () => {
    show.value = true;
};

const hidePopup = () => {
    show.value = false;
};

defineExpose({
    showPopup,
    hidePopup,
});
</script>

<style scoped>
.popup-content {
    padding: 1.5rem;
}

.popup-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-align: center;
    color: var(--text-color);
}

.repos-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 640px) {
    .repos-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
    }
}
</style>
