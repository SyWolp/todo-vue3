export default {
  namespaced: true,
  state: {
    showToast: false,
    toastMessage: "",
    toastStatus: "",
  },
  mutations: {
    UPDATE_TOAST_MESSAGE(state, payload) {
      state.toastMessage = payload;
    },
    UPDATE_TOAST_ALERT_TYPE(state, payload) {
      state.toastStatus = payload;
    },
    UPDATE_TOAST_STATUS(state, payload) {
      state.showToast = payload;
    },
  },
  actions: {
    showToastChange({ commit }, payload) {
      console.log(payload);
      commit('UPDATE_TOAST_MESSAGE', payload.message);
      commit('UPDATE_TOAST_ALERT_TYPE', payload.type);
      commit('UPDATE_TOAST_STATUS', true);
      setTimeout(() => {
        commit('UPDATE_TOAST_MESSAGE', '');
        commit('UPDATE_TOAST_ALERT_TYPE', '');
        commit('UPDATE_TOAST_STATUS', false);
      }, 2000);
    }
  },
  getters: {
    toastMessageWithSmile(state) {
      return state.toastMessage + '';
    }
  }
};