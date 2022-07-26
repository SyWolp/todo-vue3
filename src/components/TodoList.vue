<template>
  <div>
    <div class="card m-2 w-100" v-for="(todos,index) in todoList" :key="todos.id">
      <div class="card-body p-2 d-flex align-items-center">
        <div class="form-check flex-grow-1">
          <input class="form-check-input" type="checkbox" :checked="todos.completed" @change="toggleTodo(index)">
          <label class="form-check-label" :class="{done: todos.completed}" >{{todos.subject}}</label>
        </div>
        <button class="btn btn-danger btn-sm" @click="deleteTodo(index)">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    todoList: {
      type: Array,
      required: true
    }
  },

  emits: ['toggle-todo', 'delete-todo'],

  setup(props,{ emit }) {
    const toggleTodo = (index) => {
      emit('toggle-todo', index);
    };

    const deleteTodo = (index) => {
      emit('delete-todo', index);
    };
    
    return {
      toggleTodo,
      deleteTodo
    }
  }
}
</script>

<style>

</style>