<template>
  <div>
    <div class="container">
      <h1 class="text-center my-3">To-Do List</h1>
      <div class="d-flex">
        <input class="form-control" type="text" v-model="search" @input="Empty" placeholder="검색">
      </div>
      <hr />
      <TodoSimple @add-todo="addTodo" />
      <div class="m-2 text-center" v-if="!todoList.length && !search.length">일정이 없습니다 !</div>
      <div class="m-2 text-center" v-if="!filteredTodos.length && search.length">검색 결과가 없습니다!</div>
      <TodoListVue :todoList="filteredTodos" @toggle-todo="toggleTodo" @delete-todo="deleteThis" />
      <hr />
      <nav class="mx-2" aria-label="Page navigation example">
        <ul class="pagination">
          <li v-if="pages !== 1" class="page-item"><a class="page-link" @click="pageClick" href="#">이전</a></li>
          <li v-for="page in numberPage" :key="page" class="page-item" :class="pages === page ? 'active' : null"><a class="page-link" @click="pageClick" href="#">{{page}}</a></li>
          <li v-if="pages !== numberPage" class="page-item"><a class="page-link" @click="pageClick" href="#">다음</a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>
 
<script>
import { ref, reactive, computed, watch } from 'vue';
import TodoSimple from './components/TodoSimple.vue';
import TodoListVue from './components/TodoList.vue';
import axios from 'axios';

export default {
  components: {
    TodoSimple,
    TodoListVue
},
  setup() {
    const search = ref("");
    const todoList = reactive([]);
    const numberOfTodos = ref(0);
    const limit = 5;
    const pages = ref(1);

    const filteredTodos = computed(()=>{ 
      if(search.value) {
        return todoList.filter(todo => {
          return todo.subject.includes(search.value);
        })
      }else {
        return todoList;
      }
    });

    watch(todoList, ()=> {
      const info = async() => {
        try {
          const res = await axios.get(`http://localhost:3000/todoList`);
          numberOfTodos.value = res.data.length;
        } catch(err) {
          console.log(err);
        }
      }
      info();
    });
    const pageClick = (e) => {
      console.log(e.target.innerHTML);
      if(/[0-9]/.test(e.target.innerHTML)) {
        pages.value = parseInt(e.target.innerHTML);
      }else if(e.target.innerHTML === "다음") {
        pages.value++;
      }else {
        pages.value--;
      }
      getTodo();

    }
    const getTodo = async () => {
      try {
        todoList.splice(0,todoList.length);
        const res = await axios.get(`http://localhost:3000/todoList?_page=${pages.value}&_limit=${limit}`);
        // numberOfTodos.value = res.headers['x-total-count'];
        todoList.push(...res.data);
      } catch(err) {
        console.log(err);
      }
    };
    getTodo();

    const numberPage = computed(() => {
      if(numberOfTodos.value === 0) {
        return 1;
      }else {
        return Math.ceil(numberOfTodos.value/limit);
      }
    });

    const addTodo = async (todo) => {
      try {      
        const res = await axios.post('http://localhost:3000/todoList', {
        subject: todo.subject,
        computed: todo.completed,
      });
        todoList.push(res.data);
        if(((todoList.length-1) % limit === 0) && todoList.length-1 !== 0) {
          todoList.splice(0, todoList.length);
          pages.value = Math.ceil((numberOfTodos.value+1)/limit);
          getTodo();
        }
      } catch (err) {
        console.log(err);
      }
    }

    const deleteThis = async (index) => {
      const id = todoList[index].id;
      try {
        await axios.delete('http://localhost:3000/todoList/' + id);
        todoList.splice(index,1);
        if(todoList.length === 0) { 
          pages.value = 1;
          getTodo();
        }
      } catch (err) {
        console.log(err);
      }
    }

    const toggleTodo = async (index) => {
      const id = todoList[index].id;
      try {
        await axios.patch('http://localhost:3000/todoList/' + id, {
          completed: !todoList[index].completed,
        })
        todoList[index].completed = !todoList[index].completed;
      } catch (err) {
        console.log(err);
      }
    }
    return {
      todoList,
      deleteThis,
      addTodo,
      toggleTodo,
      search,
      filteredTodos,
      getTodo,
      numberPage,
      pages,
      pageClick
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