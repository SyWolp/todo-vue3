import { ref, onUnmounted } from 'vue';

export const useToast = () => {
  const showToast = ref(false);
  const toastMessage = ref("");
  const toastStatus = ref("");
  const timeOut = ref(null);
  const showToastChange = (message, type = 'success') => {
    toastMessage.value = message;
    toastStatus.value = type;
    showToast.value = true;
    timeOut.value = setTimeout(() => {
      toastMessage.value = "";
      toastStatus.value = "";
      showToast.value = false;
    }, 2000);
  };

  onUnmounted(()=> {
    clearTimeout(timeOut.value);
  });
  return {
    showToast,
    toastMessage,
    toastStatus,
    showToastChange
  }
}