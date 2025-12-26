<template>
  <Header ref="headerRef" />
  <div class="views" :style="{ paddingTop: headerHeight + 'px' }">
    <router-view />
  </div>
  <Modal ref="modalRef" />
</template>

<script setup lang="ts">
import { ref, provide, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from './components/Header.vue'
import { useGlobal } from './stores/global'
import Modal from './components/Modal.vue'

const headerRef = ref<InstanceType<typeof Header> | null>(null)
const global = useGlobal()
const modalRef = ref()

const headerHeight = computed(() => {
  return headerRef.value?.height || 0
})

provide('modal', {
  showToast: (options: any) => modalRef.value?.showToast(options),
  hideToast: () => modalRef.value?.hideToast(),
  showModal: (options: any) => modalRef.value?.showModal(options),
  hideModal: () => modalRef.value?.hideModal()
})

provide('header', {
  show: () => headerRef.value?.show(),
  hide: () => headerRef.value?.hide()
})

onMounted(() => {
  document.getElementById("loading")?.setAttribute("data-hidden", "TRUE");
  document.oncontextmenu = () => false;
  document.documentElement.setAttribute('data-theme', global.theme);
  useGlobal().initLang();

  // router.afterEach(() => {
  //   const appElement = document.getElementById('app');
  //   if (appElement) {
  //     appElement.scrollIntoView({
  //       block: 'start',
  //       behavior: 'smooth'
  //     })
  //   }
  // })
})


</script>

<style>
@import '@styles/base.css';
@import '@styles/font-awesome.css';

#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: url('@/assets/cursor.svg') 16 16, auto;
}

.views {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
