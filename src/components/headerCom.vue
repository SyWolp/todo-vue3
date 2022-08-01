<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid d-flex justify-content-between">
      <router-link class="navbar-brand" aria-current="page" :to="{ name: 'Todos', query:{state:true} }">Todos
      </router-link>
      <ul class="navbar-nav">
        <li class="nav-item">
          <button class="btn" @click="reload">로그아웃</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  props: {
    id: String
  },

  setup() {
    const router = useRouter();
    const reload = () => {
      router.replace({
        name: 'Home'
      });
    }
    return {
      reload
    }
  }

}
</script>

<style>
.logout:hover {
  color: brown;
}
</style>