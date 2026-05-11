<template>
    <Popup v-model:show="show" round position="bottom" :teleport="'body'" :style="{ height: '90%', overflow: 'hidden' }"
        :lock-scroll="false" :closeable="true">
        <div class="popup-content">
            <h2 class="popup-title">{{ t('projects.title') }}</h2>
            <div class="search-wrapper cursor-target">
                <Search class="search-icon" :size="20" />
                <input v-model="searchQuery" type="text" :placeholder="t('projects.searchPlaceholder')"
                    class="search-input" />
                <X v-if="searchQuery" class="clear-icon" :size="20" @click="clearSearch" />
            </div>
            <Scrollable ref="scrollableRef" :options="{ scrollbar: true }">
                <div class="repos-grid">
                    <AnimatePresence>
                        <Motion v-for="repo in filteredRepos" :key="repo.html_url" :layout="true"
                            :initial="{ opacity: 0, scale: 0.8, y: 20 }" :animate="{ opacity: 1, scale: 1, y: 0 }"
                            :exit="{ opacity: 0, scale: 0.8, y: -20 }"
                            :transition="{ type: 'spring', stiffness: 400, damping: 30 }">
                            <Repo :repo="repo" class="repo-item" :style="{ height: '100%' }" />
                        </Motion>
                    </AnimatePresence>
                    <div v-if="filteredRepos.length === 0" class="no-results">
                        {{ t('projects.noResults') }}
                    </div>
                </div>
            </Scrollable>
        </div>
    </Popup>
</template>

<script setup lang='ts'>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Popup } from 'vant';
import 'vant/es/popup/style';
import { Search, X } from 'lucide-vue-next';
import { Motion, AnimatePresence } from 'motion-v';
import Scrollable from '@/components/Scrollable.vue';
import { Repo } from '@/components/Projects';
import { useDebouncedRef } from '@/utils';

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
const searchQuery = ref('');
const scrollableRef = ref<typeof Scrollable | null>(null);

const { debounced: debouncedQuery, cancel: cancelDebounce } = useDebouncedRef(searchQuery, 300);

const filteredRepos = computed(() => {
    if (!debouncedQuery.value.trim()) {
        return props.repos;
    }
    const query = debouncedQuery.value.toLowerCase().trim();
    return props.repos.filter(repo =>
        repo.name.toLowerCase().includes(query) ||
        (repo.description && repo.description.toLowerCase().includes(query)) ||
        (repo.language && repo.language.toLowerCase().includes(query))
    );
});

const clearSearch = () => {
    cancelDebounce();
    searchQuery.value = '';
};

watch(() => show.value, (newVal) => {
    if (newVal) {
        clearSearch();
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
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.popup-title {
    font-size: 1.75rem;
    font-weight: 700;
    text-align: center;
    color: var(--text-color);
}

.search-wrapper {
    position: relative;
    width: 100%;
    padding: .5rem .85rem;
    font-size: large;
    border-radius: var(--border-radius);
    background: linear-gradient(to right, var(--theme-color-dark), transparent);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: var(--transition);
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;

    &::placeholder {
        opacity: 0.68;
    }
}

.repos-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

.no-results {
    text-align: center;
    padding: 3rem 1rem;
}

@media (min-width: 640px) {
    .popup-content {
        padding: 1.5rem;
    }

    .repos-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
    }
}
</style>
