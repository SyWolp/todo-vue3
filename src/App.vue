<template>
  <div>
    <div class="container">
      <h1>To-Do List</h1>
      <form @submit.prevent="plusList" class="d-flex">
        <div class="flex-grow-1 mx-2">
          <input class="form-control" type="text" v-model="todo" @input="Empty" placeholder="입력하세요.">
          <div class="mx-2" style="color: red" v-if="todoEmpty">값이 비어있습니다.</div>
        </div>
        <div>
          <button type="submit" class="btn btn-primary">추가</button>
        </div>
      </form>
      <div class="m-2" v-if="!todoList.length">일정이 없습니다 !</div>
      <div class="card m-2" v-for="(todos,index) in todoList" :key="todos.id">
        <div class="card-body p-2 d-flex align-items-center">
          <div class="form-check flex-grow-1">
            <input class="form-check-input" type="checkbox" v-model="todos.completed">
            <label class="form-check-label" :class="{done: todos.completed}" >{{todos.subject}}</label>
          </div>
          <button class="btn btn-danger btn-sm" @click="deleteThis(index)">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { ref, reactive } from 'vue';
export default {
  setup() {
    const todo = ref("");
    const todoList = reactive([]);
    const todoEmpty = ref(false); 

    const plusList = () => {
      if(todo.value === "") {
        todoEmpty.value = true;
      }else {
        todoList.push({
          id: Date.now(),
          subject : todo.value,
          completed: false
        });
        todo.value = "";
      }
    }

    const Empty = (e) => {
      if(e.target.value) {
        todoEmpty.value = false;
      }
    }

    const deleteThis = (i) => {
      todoList.splice(i, 1);
    }

    return {
      todo,
      plusList,
      todoList,
      todoEmpty,
      Empty,
      deleteThis
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