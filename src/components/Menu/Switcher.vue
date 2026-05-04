<template>
    <div class="switcher" :class="{ 'active': isAnimating }" @click="handleClick">
        <div class="icon-wrapper">
            <div class="icon-circle">
                <component :is="icon" class="switcher-icon" />
            </div>
        </div>
        <div class="switcher-text">
            <span class="label">{{ label }}</span>
            <span class="value">{{ value }}</span>
        </div>
        <div class="arrow">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" />
            </svg>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, type FunctionalComponent } from 'vue';

const props = defineProps<{
    icon: FunctionalComponent;
    label: string;
    value: string;
}>();

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

const isAnimating = ref(false);

const handleClick = (event: MouseEvent) => {
    isAnimating.value = true;
    emit('click', event);
    setTimeout(() => {
        isAnimating.value = false;
    }, 400);
};
</script>

<style scoped>
.switcher {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 16px;
    background: var(--theme-color-light);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 2px solid transparent;
    width: 100%;
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

        .arrow {
            transform: translateX(4px);
        }

        .icon-circle {
            transform: scale(1.1) rotate(10deg);
        }
    }

    &:active {
        transform: scale(0.98);
    }

    &.active {
        .icon-circle {
            animation: pulse 0.4s ease;
        }

        .switcher-icon {
            animation: rotateIn 0.4s ease;
        }
    }

    .icon-wrapper {
        flex-shrink: 0;
    }

    .icon-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--theme-color) 15%, transparent);
        transition: all 0.3s ease;

        .switcher-icon {
            width: 26px;
            height: 26px;
            color: var(--theme-color);
        }
    }

    .switcher-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .label {
            font-size: 0.85rem;
            opacity: 0.7;
            font-family: "Playball";
        }

        .value {
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--text-color);
        }
    }

    .arrow {
        flex-shrink: 0;
        color: var(--theme-color);
        opacity: 0.6;
        transition: all 0.3s ease;
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.15);
    }
}

@keyframes rotateIn {
    from {
        transform: rotate(-180deg) scale(0.5);
        opacity: 0;
    }
    to {
        transform: rotate(0deg) scale(1);
        opacity: 1;
    }
}

@media screen and (max-width: 768px) {
    .switcher {
        padding: 0.85rem 1rem;
        gap: 0.85rem;

        .icon-circle {
            width: 42px;
            height: 42px;

            .switcher-icon {
                width: 22px;
                height: 22px;
            }
        }

        .switcher-text {
            .value {
                font-size: 1.05rem;
            }
        }
    }
}
</style>