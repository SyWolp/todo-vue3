<template>
  <div class="width">
    <form>
      <!-- Email input -->
      <div class="form-outline mb-4">
        <input type="text" id="form2Example1" class="form-control" v-model="accountInfoValue.id" />
        <label class="form-label" for="form2Example1">아이디</label>
      </div>

      <!-- Password input -->
      <div class="form-outline mb-4">
        <input type="password" id="form2Example2" class="form-control" v-model="accountInfoValue.pw" />
        <label class="form-label" for="form2Example2">비밀번호</label>
      </div>

      <!-- Submit button -->

      <button type="submit" class="btn btn-primary btn-block mb-4" @click="getData">
        로그인
      </button>


      <!-- Register buttons -->
      <div class="text-center">
        <router-link class="signUp" aria-current="page" :to="{ name: 'signUp' }">회원가입</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsExports from '@/aws-exports';
Amplify.configure(awsExports);
import { getUserData } from '@/graphql/queries';
import { updateUserData } from '@/graphql/mutations';
import { useToast } from '@/hooks/toast';
import { useRouter } from 'vue-router';

export default {
  components: {

  },

  setup() {
    const router = useRouter();
    const { showToast, toastMessage, toastStatus, showToastChange } = useToast();
    const accountInfoValue = reactive({
      id: "",
      pw: "",
      name: ""
    });
    const loginState = ref(false);
    const saveId = async () => {
      try {
        await API.graphql(graphqlOperation(updateUserData, { input: { id: accountInfoValue.id, state: true } }));
        router.push({
          name: 'Todos',
          query: {
            state: loginState.value,
            username: accountInfoValue.name
          }
        });
      } catch (err) {
        console.log(err);
        showToastChange('잘못 된 접근.', 'danger');
      }
    }

    const getData = async (e) => {
      e.preventDefault();
      try {
        const res = await API.graphql(graphqlOperation(getUserData, { id: accountInfoValue.id }));
        if (res.data.getUserData.account === accountInfoValue.id && res.data.getUserData.password === accountInfoValue.pw) {
          loginState.value = true;
          accountInfoValue.name = res.data.getUserData.username;
          saveId();
        } else {
          showToastChange('비밀번호가 틀렸습니다.', 'danger');
        }
      } catch (err) {
        console.log(err);
        showToastChange('없는 아이디입니다.', 'danger');
      }
    };

    return {
      showToast,
      toastMessage,
      toastStatus,
      getData,
      accountInfoValue,
    }
  }

}
</script>

<style>
.width {
  width: 30%;
  margin: 150px auto;
}

.signUp:hover {
  color: rgb(2, 88, 122);
  cursor: pointer;
}
</style>