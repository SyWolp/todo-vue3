<template>
   <div>
      <div class="d-flex justify-content-between my-3">
         <h1 class="">To-Do List</h1>
         <button class="btn btn-primary" @click="moveToCreate">일정 생성</button>
      </div>
      <div class="d-flex">
         <input class="form-control" type="text" v-model="search" @input="Empty" @keyup.enter="searchEnter"
            placeholder="검색">
      </div>
      <hr />
      <TodoSimple @add-todo="awsAddtodo" />
      <div class="m-2 text-center" v-if="!todoList.length && !search.length">일정이 없습니다 !</div>
      <div class="m-2 text-center" v-if="!todoList.length && search.length">검색 결과가 없습니다!</div>
      <TodoListVue :todoList="filteredTodos" @toggle-todo="toggleTodo" @delete-todo="deleteThis" />
      <hr />
      <nav class="mx-2" aria-label="Page navigation example">
         <ul v-if="numberOfTodos !== 0" class="pagination">
            <li v-if="prevToken.length !== 0" class="page-item">
               <a class="page-link" @click="prevPP" href="#">이전</a>
            </li>
            <li v-for="page in Math.ceil(numberOfTodos / 5)" :key="page" class="page-item"
               :class="prevToken.length + 1 === page ? 'active' : null">
               <a class="page-link" href="#">{{ page }}</a>
            </li>
            <li v-if="Math.ceil(numberOfTodos / 5) - 1 !== prevToken.length" class="page-item">
               <a class="page-link" @click="nextPP" href="#">다음</a>
            </li>
         </ul>
      </nav>
   </div>
   <transition name="fade">
      <setToast v-if="showToast" :message="toastMessage" :type="toastStatus" />
   </transition>
</template>
 
<script>
import { ref, reactive, computed, watch } from 'vue';
import TodoSimple from '@/components/TodoSimple.vue';
import TodoListVue from '@/components/TodoList.vue';
import setToast from '@/components/setToast.vue';
import { createTodoList, deleteTodoList, updateTodoList } from '@/graphql/mutations';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsExports from '@/aws-exports';
Amplify.configure(awsExports);
import { listTodoLists } from '@/graphql/queries';
import { useToast } from '@/hooks/toast';
import { useRouter } from 'vue-router';
export default {
   components: {
      TodoSimple,
      TodoListVue,
      setToast,
   },
   setup() {
      const router = useRouter();
      const search = ref("");
      const todoList = reactive([]);
      const numberOfTodos = ref(0);
      const limit = 5;
      const nextNextToken = ref("");
      const nextToken = ref(null);
      const prevToken = ref([]);
      const loading = ref(false);

      const { showToast, toastMessage, toastStatus, showToastChange } = useToast();

      const filteredTodos = computed(() => {
         if (search.value) {
            return todoList.filter(todo => {
               return todo.subject.includes(search.value);
            })
         } else {
            return todoList;
         }
      });
      watch(todoList, () => {
         const info = async () => {
            const res = await API.graphql(graphqlOperation(listTodoLists));
            numberOfTodos.value = res.data.listTodoLists.items.length;
         }
         info();
      });

      const nextPP = () => {
         if ((numberOfTodos.value / 5) - 1 === prevToken.value.length) {
            nextToken.value = null;
         } else {
            prevToken.value = [...prevToken.value, nextToken.value];
            nextToken.value = nextNextToken.value;
            nextNextToken.value = null;
         }
         getTodo();
      }
      const prevPP = () => {
         console.log(prevToken.value);
         nextToken.value = prevToken.value.pop();
         prevToken.value = [...prevToken.value];
         nextNextToken.value = null;
         getTodo();
      }

      const getTodo = async () => {
         try {
            todoList.splice(0, todoList.length);
            const res = await API.graphql(graphqlOperation(listTodoLists, { limit, nextToken: nextToken.value}));
            todoList.push(...res.data.listTodoLists.items);
            todoList.sort((a,b)=>{
               return b.create - a.create; 
            })
            nextNextToken.value = res.data.listTodoLists.nextToken;
         } catch (err) {
            showToastChange('잘못 된 접근입니다.', 'danger');
            console.log(err);
         }
      };
      getTodo();

      const numberPage = computed(() => {
         if (numberOfTodos.value === 0) {
            return 1;
         } else {
            return Math.ceil(numberOfTodos.value / limit);
         }
      });

      const awsAddtodo = async (todo) => {
         try {
            loading.value = false;
            if(!loading.value) {
               await API.graphql(graphqlOperation(createTodoList, { input: todo }));
               nextToken.value = null;
               prevToken.value.splice(0,prevToken.value.length);
               getTodo();
               loading.value = true;
            }
         } catch (err) {
            console.log(err);
         }
      }

      const deleteThis = async (index) => {
         const id = index;
         try {
            await API.graphql(graphqlOperation(deleteTodoList, { input: { id: id } }));
            if(todoList.length === 1) {
               console.log("1");
               nextToken.value = null;
               prevToken.value.splice(0,prevToken.value.length);
               getTodo();
            }else {
               getTodo();
            }
            showToastChange("삭제 되었습니다.", 'info');
         } catch (err) {
            console.log(err);
            showToastChange('잘못 된 접근입니다.', 'danger');
         }
      }

      const toggleTodo = async (index, checked) => {
         const id = todoList[index].id;
         console.log(checked);
         try {
            await API.graphql(graphqlOperation(updateTodoList, { input: { id: id, Success: checked } }));
            todoList[index].Success = checked;
            getTodo();
         } catch (err) {
            console.log(err);
            showToastChange('잘못 된 접근입니다.', 'danger');
         }
      }

      const moveToCreate = () => {
         router.push({
            name: "CreateTodo"
         });
      }

      let timeOut = null;
      const searchEnter = () => {
         clearTimeout(timeOut);
         getTodo();
      }
      watch(search, () => {
         clearTimeout(timeOut);
         timeOut = setTimeout(() => {
            getTodo();
         }, 1000);
      });

      return {
         todoList,
         deleteThis,
         toggleTodo,
         search,
         getTodo,
         numberPage,
         numberOfTodos,
         searchEnter,
         showToast,
         toastMessage,
         toastStatus,
         moveToCreate,
         awsAddtodo,
         nextPP,
         prevPP,
         prevToken,
         filteredTodos
      };
   }
}
</script>

<style>
.done {
   color: gray;
   text-decoration: line-through;
}

.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
   transform: translateY(-110%);
   transition: 0.5s
}

.fade-enter-to,
.fade-leave-from {
   opacity: 1;
   transform: translateY(0);
   transition: 0.5s
}
</style>