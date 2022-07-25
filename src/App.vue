<template>
  <div>
    <div class="container">
      <h1>To-Do List</h1>
      <TodoSimple @add-todo="addTodo" />
      <div class="m-2" v-if="!todoList.length">일정이 없습니다 !</div>
      <TodoListVue :todoList="todoList" @toggle-todo="toggleTodo" />
    </div>
  </div>
</template>
 
<script>
import { reactive } from 'vue';
import TodoSimple from './components/TodoSimple.vue';
import TodoListVue from './components/TodoList.vue';
export default {
  components: {
    TodoSimple,
    TodoListVue
},
  setup() {
    // const todo = ref("");
    const todoList = reactive([]);

    const addTodo = (todo) => {
      todoList.push(todo);
    }

    const deleteThis = (i) => {
      todoList.splice(i, 1);
    }

    const toggleTodo = (index) => {
      todoList[index].completed = !todoList[index].completed;
    }

    return {
      todoList,
      deleteThis,
      addTodo,
      toggleTodo
    };
  }
}
</script>

<style>
  .done {
    color: gray;
    text-decoration: line-through;
  }
</style>