<template>
    <Scrollable ref="scrollRef">
        <div class="wrapper">
            <ProfileSection @link-click="openLink" />
            <div class="content">
                <TodaySection />
                <div id="projects">
                    <RepoCard v-for="repo in filteredRepos" :key="repo.html_url" :repo="repo" @click="openLink" />
                </div>
            </div>
        </div>
    </Scrollable>
</template>

<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEnv } from '@/stores/env';
import { useGlobal } from '@/stores/global';
import { filterRepos } from '@/utils';
import { 
    Scrollable, 
    ProfileSection, 
    TodaySection, 
    RepoCard 
} from '@/components';
import { showConfirmDialog } from 'vant';
import 'vant/es/dialog/style';

const { t } = useI18n();
const env = useEnv();
const global = useGlobal();
const scrollRef = ref<any>(null);

const filteredRepos = computed(() => {
    return filterRepos(global.gh_repos, ['roy-jin', 'cloud', 'learn'], env.gh_repos.show_count);
});

const openLink = (path: string) => {
    showConfirmDialog({
        title: t('tips.openLink.title'),
        message: `${t('tips.openLink.message')}\n\n${path}`,
        cancelButtonColor: 'color-mix(in srgb, grey 60%, transparent)',
        confirmButtonColor: 'var(--theme-color)',
        closeOnClickOverlay: true
    }).then(() => {
        window.open(path, '_blank');
    }).catch(() => {});
};

onMounted(async () => {
    await global.loadSayings(env.sayings);
    await global.loadGhRepos(env.gh_repos);
    scrollRef.value?.refresh();
    scrollRef.value?.scrollTo(0, 0);
    document.getElementById('loading')?.setAttribute('data-hidden', 'TRUE');
});
</script>

<style scoped>
.wrapper {
    gap: 2rem;
    width: 100%;
    height: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}

.content {
    gap: 1rem;
    display: flex;
    max-width: 500px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

#projects {
    gap: .5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media screen and (max-width: 768px) {
    .wrapper {
        flex-direction: column;
        height: unset;
    }
    
    .content {
        width: 80%;
        margin-bottom: 1rem;
    }
}
</style>
