<template>
  <div>
    <headerCom :name="state.name" :state="true" />
    <TodoForm :editing="true" :state="true" :name="state.name" />
  </div>
</template>

<script>
import headerCom from '@/components/headerCom.vue';
import TodoForm from '@/components/todoForm.vue';
import { useRoute } from 'vue-router';
import { reactive } from '@vue/reactivity';
export default {
  components: {
    TodoForm,
    headerCom
  },

  setup() {
    const route = useRoute();
    console.log(route.query);
    const state = reactive({
      name: route.query.name,
      state: route.query.state
    });

    return {
      state
    }
  }
}
</script>

<style>
</style>