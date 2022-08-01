<template>
  <div>
    <headerCom />
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
          <div v-if="editing" class="form-group">
            <label>상태</label>
            <div>
              <button @click.prevent="statusCheck" class="btn" :class="todo.Success ? 'btn-success' : 'btn-danger'">{{
                todo.Success ? '완료' : '미완료'
                }}</button>
            </div>
          </div>
        </div>
        <div class="col-12">
          <label>내용</label>
          <textarea v-model="todo.bodyText" class="form-control" cols="30" rows="10"></textarea>
        </div>
      </div>
      <div class="mt-2">
        <button :disabled="!ChangeStatus" type="submit" class="btn btn-primary">저장</button>
        <button @click="moveToTodo" type="button" class="btn btn-outline-dark mx-2">취소</button>
      </div>
    </form>
    <div v-else>로딩 중...</div>
    <transition name="fade">
      <setToast v-if="showToast" :message="toastMessage" :type="toastStatus" />
    </transition>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import _ from 'lodash';
import headerCom from '@/components/headerCom.vue';
import setToast from '@/components/setToast.vue';
import { useToast } from '@/hooks/toast';
import { updateTodoList, createTodoList } from '@/graphql/mutations';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsExports from '@/aws-exports';
Amplify.configure(awsExports);
import { getTodoList } from '@/graphql/queries';

export default {
  components: {
    setToast,
    headerCom
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    }
  },
  setup( props ) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: "",
      Success: false,
      bodyText: ''
    });
    const realTodo = ref(null);
    const loading = ref(false);
    const { showToast, toastMessage, toastStatus, showToastChange } = useToast();


    const getTodo = async () => {
      loading.value = true;
      try {
      const res = await API.graphql(graphqlOperation(getTodoList,{id:route.params.id}));
      console.log(res);
      console.log(route.params.id);
      todo.value = {...res.data.getTodoList};
      realTodo.value = {...res.data.getTodoList};
      loading.value = false;
      } catch(err) {
          loading.value = false;
          console.log(err);
          showToastChange('잘못 된 접근입니다.', 'danger');
      } 
    };

    if( props.editing ) {
      getTodo();
    }else {
      console.log("a");
    }
    

    const statusCheck = async () => {
      todo.value.Success = !todo.value.Success;
    };
    
    const moveToTodo = () => {
      router.replace({
        name: "Todos",
        query: {
          state: true
        }
      })
    };

    const ChangeStatus = computed(() => {
      if( props.editing ) {
        return !_.isEqual(todo.value, realTodo.value) && todo.value.subject;
      }else {
        return todo.value.subject;
      }
    });
    
    const saveBtn = async () => {
      try {
        const res = ref(null);
        if (props.editing) {
          res.value = await API.graphql(graphqlOperation(updateTodoList, {
            input: {
              id: route.params.id,
              subject: todo.value.subject,
              Success: todo.value.Success,
              create: Date.now(),
              bodyText: todo.value.bodyText
            }
          }));
          realTodo.value = {...res.value.data};
        } else {
          const nowDate = new Date();
            res.value = await API.graphql(graphqlOperation(createTodoList, {
              input: {
                id: Date.now(),
                subject: todo.value.subject,
                Success: false,
                date: `${nowDate.getFullYear()}년 ${nowDate.getMonth()}월 ${nowDate.getDate()}일`,
                create: Date.now(),
                bodyText: todo.value.bodyText
              }
            }));
          todo.value.subject = "";
          todo.value.bodyText = "";
        }
      showToastChange("저장 되었습니다.");
      } catch (err) {
        console.log(err);
        showToastChange("잘못 된 접근입니다.", "danger");
      }
    };

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