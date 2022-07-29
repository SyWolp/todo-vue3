import { createRouter, createWebHistory } from "vue-router";
import Home from '../pages/indexVue.vue';
import Todos from '../pages/todos/indexVue.vue';
import Todo from '../pages/todos/_id.vue';
import CreateTodos from '@/pages/todos/create/indexVue.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/todos',
      name: 'Todos',
      component: Todos
    },
    {
      path: '/todos/create',
      name: 'CreateTodo',
      component: CreateTodos
    },
    {
      path: '/todos/:id',
      name: 'Todo',
      component: Todo
    } 
  ]
});

export default router;