<template>
    <div @click="handleClick" class="project cursor-target" :class="{ 'active': isAnimating }"
        :style="{ background: `color-mix(in srgb, ${repo.color ?? ''} 20%, transparent)` }">
        <div class="project-content">
            <div class="project-header">
                <div class="project-name">{{ repo.name }}</div>
            </div>
            <div v-if="repo.description" class="project-description">
                <TextEllipsis :content="repo.description" rows="2" :expand-text="t('tips.expand')"
                    :collapse-text="t('tips.collapse')" @click-action="(event) => {
                        event.stopPropagation();
                    }" />
            </div>
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Star, Circle, GitFork, Eye, Clock } from 'lucide-vue-next';
import { showConfirmDialog, TextEllipsis } from 'vant';
import 'vant/es/text-ellipsis/style';

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

const isAnimating = ref(false);

const handleClick = () => {
    isAnimating.value = true;
    setTimeout(() => {
        isAnimating.value = false;
    }, 400);
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
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 2px solid transparent;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--theme-color) 10%, transparent), transparent);
        transition: left 0.6s ease;
    }

    &:hover {
        border-color: var(--theme-color);
        box-shadow: 0 8px 24px color-mix(in srgb, var(--theme-color) 20%, transparent);

        &::before {
            left: 100%;
        }

        .project-name {
            transform: translateX(4px);
        }
    }

    &:active {
        transform: scale(0.98);
    }

    &.active {
        .project-content {
            animation: pulse 0.4s ease;
        }
    }
}

.project-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    justify-content: space-between;
    position: relative;
    z-index: 1;
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.project-name {
    font-size: 1.5rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: transform 0.3s ease;
}

.project-description {
    font-size: 0.9rem;
    font-family: "仓耳渔阳体";
    --van-text-ellipsis-action-color: var(--theme-color);
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

@media (max-width: 480px) {

    .stat-item:nth-child(3),
    .stat-item:nth-child(4) {
        display: none;
    }
}

.project-updated {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8rem;
    opacity: 0.65;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.02);
    }
}
</style>
