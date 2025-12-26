<template>
    <div ref="wrapperRef" class="scroll-wrapper">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import BScroll from '@better-scroll/core'
import type { Options } from '@better-scroll/core'

// Props：允许外部传入配置
const props = withDefaults(
    defineProps<{
        options?: Options
    }>(),
    {
        options: () => ({})
    }
)

const wrapperRef = ref<HTMLDivElement | null>(null)
let bsInstance: BScroll | null = null

const defaultOptions: Options = {
    scrollY: true,
    bounce: true,        // 回弹效果
    momentum: true,      // 惯性滚动
    observeDOM: true,    // 自动监听 DOM 变化
    observeImage: true,
    ...props.options
}

const debounce = (func: Function, wait: number) => {
    let timeout: number;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    }
}
const refresh = debounce(() => {
    if (bsInstance) {
        bsInstance.refresh()
    }
}, 500)


onMounted(() => {
    if (wrapperRef.value) {
        bsInstance = new BScroll(wrapperRef.value, defaultOptions)
    }
    window.addEventListener("resize", () => refresh())
})

onUnmounted(() => {
    bsInstance?.destroy()
    bsInstance = null
    window.removeEventListener("resize", () => refresh())
})

watch(
    () => props.options,
    (newOpts) => {
        if (bsInstance) {
            bsInstance.refresh()
        }
    },
    { deep: true }
)

// 暴露方法给父组件
defineExpose({
    refresh() {
        bsInstance?.refresh()
    },
    scrollTo(x: number, y: number, time = 300) {
        bsInstance?.scrollTo(x, y, time)
    },
    getBScrollInstance(): BScroll | null {
        return bsInstance
    }
})
</script>

<style scoped>
.scroll-wrapper {
    width: 100%;
    height: 100%;
}
</style>