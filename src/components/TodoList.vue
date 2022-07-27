<template>
  <div>
    <div class="card m-2 w-100" @click="moveToPage(todoList.id)" v-for="(todoList,index) in todoList" :key="todoList.id" style="cursor: pointer">
      <div class="card-body p-2 d-flex align-items-center">
        <div class="form-check flex-grow-1">
          <input class="form-check-input" type="checkbox" :checked="todoList.Success" @change="toggleTodo(index, $event)" @click.stop>
          <label class="form-check-label" :class="{done: todoList.Success}" >{{todoList.subject}}</label>
        </div>
        <div class="mx-5">{{todoList.date}}</div>
        <button class="btn btn-danger btn-sm" @click.stop="deleteTodo(index)">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  props: {
    todoList: {
      type: Array,
      required: true
    }
  },

  emits: ['toggle-todo', 'delete-todo'],

  setup(props,{ emit }) {
    const router = useRouter(); 

    const toggleTodo = (index, event) => {
      emit('toggle-todo', index, event.target.checked);
    };

    const deleteTodo = (index) => {
      emit('delete-todo', index);
    };

    const moveToPage = (todoId) => {
      console.log(todoId);
      router.push({
        name: 'Todo',
        params: {
          id: todoId,
        }
      })
    }
    
    return {
      toggleTodo,
      deleteTodo,
      moveToPage,
    }
  }
}
</script>

<style>

</style>