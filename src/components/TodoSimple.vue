<template>
  <form @submit.prevent="plusList" class="d-flex">
    <div class="flex-grow-1 mx-2">
      <input class="form-control" type="text" v-model="todo" @input="Empty" placeholder="입력하세요.">
      <div class="mx-2" style="color: red" v-if="todoEmpty">값이 비어있습니다.</div>
    </div>
    <div>
      <button type="submit" class="btn btn-primary">추가</button>
    </div>
  </form>
</template>

<script>
  import { ref }  from 'vue';

  export default {
    emits: ['add-todo'],

    setup(props, { emit }) {
      const todo = ref('');
      const todoEmpty = ref(false); 
      const plusList = () => {
        if(todo.value === "") {
          todoEmpty.value = true;
        }else {
          const nowDate = new Date();
          emit('add-todo', {
            id: Date.now(),
            subject : todo.value,
            Success: false,
            date: `${nowDate.getFullYear()}년 ${nowDate.getMonth()}월 ${nowDate.getDate()}일`,
            create: Date.now()
          });
          todo.value = "";
        }
      }

      const Empty = (e) => {
        if(e.target.value) {
          todoEmpty.value = false;
        }
      }
      return {
        todo,
        todoEmpty,
        plusList,
        Empty
      };
    }
  }
</script>

<style>

</style>