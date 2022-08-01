<template>
  <headerCom :name="state.name" :state="true"/>
  <TodoForm :state="true" :name="state.name" />
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
    const state = reactive({
      name: route.query.name,
      state: route.query.state
    });
    console.log(route.query.username);

    return {
      state
    }
  }
}
</script>

<style>
</style>