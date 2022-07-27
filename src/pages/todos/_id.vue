<template>
  <div>
    <h1>Todo Page</h1>
    <form @submit.prevent="saveBtn" v-if="loading === false">
      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label>제목</label>
            <input type="text" v-model="todo.subject" class="form-control">
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label>상태</label>
            <div>
              <button @click.prevent="statusCheck" class="btn" :class="todo.Success ? 'btn-success' : 'btn-danger' ">{{todo.Success ? '완료' : '미완료'}}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2">
        <button :disabled="!ChangeStatus" type="submit" class="btn btn-primary">저장</button>
        <button @click="moveToTodo" type="button" class="btn btn-outline-dark mx-2">취소</button>
      </div>
    </form> 
    <div v-else>로딩 중...</div>
    <setToast v-if="showToast" :message="toastMessage" :type="toastStatus" />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import _ from 'lodash';
import setToast from '@/components/setToast.vue';
export default {
  components: {
    setToast
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const realTodo = ref(null);
    const loading = ref(true);
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastStatus = ref("");
    const getTodo = async () => {
      try {
      const res = await axios.get(`http://localhost:3000/todoList/${route.params.id}`);
      todo.value = {...res.data};
      realTodo.value = {...res.data};
      loading.value = false;
      } catch(err) {
        console.log(err);
      } 
    };
    getTodo();

    const statusCheck = async () => {
      todo.value.Success = !todo.value.Success;
    };
    
    const moveToTodo = () => {
      router.push({
        name: "Todos",
      })
    };

    const ChangeStatus = computed(() => {
      return !_.isEqual(todo.value, realTodo.value);
    });
    
    const showToastChange = (message, type = 'success') => {
      toastMessage.value = message;
      toastStatus.value = type;
      showToast.value = true;
      setTimeout(() => {
        toastMessage.value = "";
              toastStatus.value = "";
        showToast.value = false;
      }, 2000);
    }

    const saveBtn = async () => {
      try {
        await axios.patch('http://localhost:3000/todoList/' + route.params.id, {
          subject: todo.value.subject,
          Success: todo.value.Success,
          create: Date.now(),
        });
      // router.push({
      //   name: "Todos",
      // });
      showToastChange("저장 되었습니다.");
      } catch (err) {
        showToastChange("잘못 된 접근입니다.", "danger");
        showToast.value = true;
      }
    }

    return {
      todo,
      loading,
      statusCheck,
      moveToTodo,
      saveBtn,
      ChangeStatus,
      showToast,
      toastMessage,
      toastStatus
    }
  },
}
</script>

<style>

</style>