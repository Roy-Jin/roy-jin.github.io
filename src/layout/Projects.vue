<template>
    <div class="projects">
        <Repo v-if="filteredRepos[0]" :repo="filteredRepos[0]" />
        <button class="show-more-btn cursor-target" @click="repoAllRef?.showPopup">
            {{ t('projects.showMore') }}
        </button>
    </div>
    <RepoAll ref="repoAllRef" :repos="filteredRepos" />
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useGlobal } from '@/stores/global';
import { filterRepos } from '@/utils';
import { Repo, RepoAll } from '@/components/Projects';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const global = useGlobal();

const repoAllRef = ref<typeof RepoAll | null>(null);

const filteredRepos = computed(() => {
    return filterRepos(global.gh_repos, ['roy-jin', 'cloud', 'learn']);
});
</script>

<style scoped>
.projects {
    gap: .5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.show-more-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    margin-top: 0.5rem;
    border: 2px solid var(--theme-color);
    border-radius: var(--border-radius);
    background-color: var(--theme-color-light);
}
</style>
