<template>
  <div>        
    <TodoForm :editing="true" />
  </div>
</template>

<script>
import TodoForm from '@/components/todoForm.vue';
export default {
  components: {
    TodoForm
},
}

</script>

<style>

</style>