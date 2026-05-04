<template>
    <div class="projects">
        <Repo v-for="repo in filteredRepos" :key="repo.html_url" :repo="repo" />
    </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { useGlobal } from '@/stores/global';
import { filterRepos } from '@/utils';
import { Repo } from '@/components/Projects';
import { useEnv } from '@/stores/env';

const env = useEnv();
const global = useGlobal();

const filteredRepos = computed(() => {
    return filterRepos(global.gh_repos, ['roy-jin', 'cloud', 'learn'], env.gh_repos.show_count);
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
</style>
