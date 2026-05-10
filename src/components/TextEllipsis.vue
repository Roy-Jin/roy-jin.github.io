<template>
    <div ref="containerRef">
        <TextEllipsis :key="renderKey" v-bind="$attrs" :expand-text="props.expandText || t('tips.expand')"
            :collapse-text="props.collapseText || t('tips.collapse')" :content="computedContent" :rows="props.rows"
            @click-action="(event: MouseEvent) => {
                event.stopPropagation();
            }" />
    </div>
</template>

<script setup lang='ts'>
import { TextEllipsis } from 'vant';
import 'vant/es/text-ellipsis/style';
import { useI18n } from 'vue-i18n';
import { computed, useSlots, ref, onMounted, onUnmounted } from 'vue';

const { t } = useI18n();
const slots = useSlots();
const containerRef = ref<HTMLElement | null>(null);
const renderKey = ref(0);

const props = defineProps({
    expandText: {
        type: String,
    },
    collapseText: {
        type: String,
    },
    content: {
        type: String,
        default: ''
    },
    rows: {
        type: [Number, String],
        default: '2'
    }
});

const computedContent = computed(() => {
    if (slots.default) {
        const slotContent = slots.default();
        if (slotContent.length > 0) {
            return slotContent.map(node => {
                if (typeof node.children === 'string') {
                    return node.children;
                }
                return '';
            }).join('');
        }
    }
    return props.content;
});

let observer: IntersectionObserver | null = null;

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                renderKey.value++;
                observer?.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.01
    });

    if (containerRef.value) {
        observer.observe(containerRef.value);
    }
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
</script>

<style scoped>
.van-text-ellipsis {
    --van-text-ellipsis-action-color: var(--theme-color);
}
</style>