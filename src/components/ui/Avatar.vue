<template>
    <svg class="avatar cursor-target" :style="{ cursor: 'none !important' }" width="100%" height="100%" viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="circleClip">
                <circle cx="100" cy="100" r="100" />
            </clipPath>
        </defs>
        <foreignObject x="0" y="0" width="200" height="200" clip-path="url(#circleClip)">
            <div xmlns="http://www.w3.org/1999/xhtml"
                style="position: relative; width: 200px; height: 200px;">
                <img :src="env.avatar[0]" style="width: 200px; height: 200px; object-fit: cover;" />
                <video v-if="env.avatar_video" width="200" height="200" autoplay loop muted playsinline disablepictureinpicture
                    disableremoteplayback
                    style="width: 200px; height: 200px; position: absolute; top: 0; left: 0; object-fit: cover;"
                    controlslist="nodownload nofullscreen noremoteplayback">
                    <source :src="env.avatar_video" type="video/webm" />
                </video>
                <div
                    style="position: absolute; top: 0; left: 0; width: 200px; height: 200px; pointer-events: none;">
                </div>
            </div>
        </foreignObject>
    </svg>
</template>

<script setup lang='ts'>
import { useEnv } from '@/stores/env';

const env = useEnv();
</script>

<style scoped>
.avatar {
    max-width: 66%;
}
</style>
