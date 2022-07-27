<template>
  <div class="alert toastBox" :class="`alert-${type}`" role="alert">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success'
    }
  }
}
</script>

<style>
  .toastBox {
    position: fixed;
    top: 2%;
    right: 2%;
  }
</style>