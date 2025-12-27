<template>
  <Header ref="headerRef" />
  <div class="views" :style="{ paddingTop: headerHeight + 'px' }">
    <router-view />
  </div>
  <van-config-provider :theme="global.theme" />
</template>

<script setup lang="ts">
import { ref, provide, onMounted, computed, defineAsyncComponent } from 'vue'
import { useGlobal } from './stores/global'

const Header = defineAsyncComponent(() => import('@/components/Header.vue'))

const headerRef = ref<InstanceType<typeof Header> | null>(null)
const global = useGlobal()

const headerHeight = computed(() => {
  return headerRef.value?.height || 0
})

provide('header', {
  show: () => headerRef.value?.show(),
  hide: () => headerRef.value?.hide()
})

onMounted(() => {
  window.addEventListener('load', () => {
    document.getElementById("loading")?.setAttribute("data-hidden", "TRUE");
  })
  document.oncontextmenu = () => false;
  document.documentElement.setAttribute('data-theme', global.theme);
  useGlobal().initLang();
})


</script>

<style>
@import '@styles/base.css';

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.views {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
