<template>
  <div>
    <div class="card m-2 w-100" @click="moveToPage(todoList.id)" v-for="(todoList,index) in todoList" :key="todoList.id" style="cursor: pointer">
      <div class="card-body p-2 d-flex align-items-center">
        <div class="flex-grow-1">
          <input class="mx-2" type="checkbox" :checked="todoList.Success" @change="toggleTodo(index, $event)" @click.stop>
          <span class="mx-2" :class="{done: todoList.Success}" >{{todoList.subject}}</span>
        </div>
        <div class="mx-5">{{todoList.date}}</div>
        <button class="btn btn-danger btn-sm" @click.stop="openModal(todoList.id)">삭제</button>
      </div>
    </div>
  </div>
  <modalPage v-if="showDelete" @close="closeModal" @deleteNow="deleteTodo(todoId)" />
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import modalPage from '@/components/modalPage.vue';

export default {
  components: {
    modalPage
  },
  props: {
    todoList: {
      type: Array,
      required: true
    }
  },

  emits: ['toggle-todo', 'delete-todo'],

  setup(props,{ emit }) {
    const router = useRouter(); 
    const showDelete = ref(false);
    const todoId = ref(null);
    const toggleTodo = (index, event) => {
      emit('toggle-todo', index, event.target.checked);
    };

    const openModal = (id) => {
      console.log(id);
      todoId.value = id;
      showDelete.value = true;
    }
    const closeModal = () => {
      todoId.value = null;
      showDelete.value = false;
    }

    const deleteTodo = (todoId) => {
      emit('delete-todo', todoId);
      showDelete.value = false;
    };

    const moveToPage = (todoId) => {
      router.replace({
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
      showDelete,
      openModal,
      closeModal,
      todoId
    }
  }
}
</script>

<style>

</style>