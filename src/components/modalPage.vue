<template>
  <div class="modalWrap">
    <div class="modalBox d-flex flex-column justify-content-around">
      <div class="text-center">삭제 하시겠습니까?</div>
      <div class="d-flex justify-content-around">
        <button class="btn btn-danger buttonWidth" @click="delteBtn" tabindex="1">확인</button>
        <button class="btn btn-dark buttonWidth" @click="onClose" tabindex="10">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    deleteId: {
      type : Number,
    }
  },
  emits: ['close', 'deleteNow'],
  
  setup(props, { emit }) {
    const onClose = () => {
      emit('close');
    }
    const delteBtn = () => {
      emit('deleteNow');
    }
    return {
      onClose,
      delteBtn
    }
  }
}
</script>

<style>
  .modalBox {
    width: 15%;
    height: 15%;
    background-color: rgb(255,255,255);
    position: absolute;
    border-radius: 15px;
    top: 25%;
    left: 50%;
    transform: translate(-50%,-25%);
  }
  .modalWrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
  .buttonWidth {
    width: 30%;
  }
</style>