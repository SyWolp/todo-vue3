<template>
  <div>
    <div class="card m-2" v-for="(todos,index) in todoList" :key="todos.id">
      <div class="card-body p-2 d-flex align-items-center">
        <div class="form-check flex-grow-1">
          <input class="form-check-input" type="checkbox" :value="todos.completed" @change="toggleTodo(index)">
          <label class="form-check-label" :class="{done: todos.completed}" >{{todos.subject}}</label>
        </div>
        <button class="btn btn-danger btn-sm" @click="deleteThis(index)">삭제</button>
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
  setup(props,context) {
    const toggleTodo = (index) => {
      context.emit('toggle-todo', index);
    };
    
    return {
      toggleTodo
    }
  }
}
</script>

<style>

</style>