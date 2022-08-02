import { computed } from 'vue';
import { useStore } from 'vuex';

export const useToast = () => {
  const store = useStore();
  const showToast =  computed(() => store.state.toast.showToast);
  const toastMessage = computed(() => store.getters["toast/toastMessageWithSmile"]);
  const toastStatus = computed(() => store.state.toast.toastStatus);

  const showToastChange = (message, type = 'success') => {
    store.dispatch('toast/showToastChange', {message, type});
  };

  return {
    showToast,
    toastMessage,
    toastStatus,
    showToastChange
  }
}