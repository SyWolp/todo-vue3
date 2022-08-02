<template>
  <div class="w-75 mx-auto">
    <router-view />
    <transition name="slide">
      <setToastVue v-if="showToast" :message="toastMessage" :type="toastStatus" />
    </transition>
  </div>
</template>

<script>
import setToastVue from './components/setToast.vue';
import { useToast } from '@/hooks/toast';
export default {
  components: {
    setToastVue
  },
  setup() {
    const { showToast, toastMessage, toastStatus, showToastChange } = useToast();

    return {
      showToast,
      toastMessage,
      toastStatus,
      showToastChange,
    }
  }
}
</script>

<style scoped>

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-110%);
  transition: 0.5s
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  transition: 0.5s
}
</style>