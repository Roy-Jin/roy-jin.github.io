<template>
    <div @click="handleClick" class="project cursor-target"
        :style="{ background: `color-mix(in srgb, ${repo.color ?? ''} 20%, transparent)` }">
        <div class="project-content">
            <div class="project-header">
                <div class="project-name">{{ repo.name }}</div>
            </div>
            <div v-if="repo.description" class="project-description">{{ repo.description }}</div>
            <div class="project-footer">
                <div class="project-stats">
                    <span v-if="repo.language" class="stat-item">
                        <Circle :size="14" />
                        {{ repo.language }}
                    </span>
                    <span v-if="repo.stargazers_count !== undefined" class="stat-item">
                        <Star :size="14" />
                        {{ repo.stargazers_count }}
                    </span>
                    <span v-if="repo.forks_count !== undefined" class="stat-item">
                        <GitFork :size="14" />
                        {{ repo.forks_count }}
                    </span>
                    <span v-if="repo.watchers_count !== undefined" class="stat-item">
                        <Eye :size="14" />
                        {{ repo.watchers_count }}
                    </span>
                </div>
                <div v-if="repo.pushed_at" class="project-updated">
                    <Clock :size="14" />
                    <span>{{ formatDate(repo.pushed_at) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Star, Circle, GitFork, Eye, Clock } from 'lucide-vue-next';
import { showConfirmDialog } from 'vant';

const { t } = useI18n();
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
    repo: Repo;
}>();

const handleClick = () => {
    if (props.repo.html_url) {
        showConfirmDialog({
            title: t('tips.openLink.title'),
            message: `${t('tips.openLink.message')}\n\n${props.repo.html_url}`,
            cancelButtonColor: 'color-mix(in srgb, grey 60%, transparent)',
            confirmButtonColor: 'var(--theme-color)',
            closeOnClickOverlay: true
        }).then(() => {
            window.open(props.repo.html_url, '_blank');
        }).catch(() => { });
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return t('date.today');
    } else if (diffDays === 1) {
        return t('date.yesterday');
    } else if (diffDays < 30) {
        return t('date.daysAgo', {
            days: diffDays
        });
    } else if (diffDays < 365) {
        return t('date.monthsAgo', {
            months: Math.floor(diffDays / 30)
        });
    } else {
        return t('date.yearsAgo', {
            years: Math.floor(diffDays / 365)
        });
    }
};
</script>

<style scoped>
.project {
    width: 100%;
    padding: 1rem;
    display: flex;
    border-radius: 10px;
    text-decoration: none;
    color: var(--text-color);
    font-family: "Electrolize", sans-serif;
    border-left: 4px solid var(--theme-color);
    background-color: var(--theme-color-light);
}

.project-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.project-name {
    font-size: 1.15rem;
    font-weight: 600;
}

.project-description {
    font-size: 0.9rem;
    opacity: 0.8;
    line-height: 1.5;
    font-family: "仓耳渔阳体";
}

.project-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.project-stats {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-size: 0.85rem;
    opacity: 0.75;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.project-updated {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8rem;
    opacity: 0.65;
}
</style>
