<template>
  <div class="width">
    <form>
      <!-- 2 column grid layout with text inputs for the first and last names -->
      <div class="row mb-4">
        <div class="col">
          <div class="form-outline">
            <input type="text" id="form3Example1" class="form-control" v-model="userInfo.username" placeholder="성명" />
          </div>
        </div>
      </div>
      <!-- Email input -->
      <div class="form-outline mb-4">
        <input type="text" id="form3Example3" class="form-control" v-model="userInfo.account"
          placeholder="아이디 (4자리 이상)" />
      </div>

      <!-- Password input -->
      <div class="form-outline mb-4">
        <input type="password" id="form3Example4" class="form-control" v-model="userInfo.password"
          placeholder="비밀번호 (4자리 이상)" />
      </div>

      <!-- Submit button -->
      <button type="submit" @click.prevent="submitBtn" class="btn btn-primary btn-block mb-4">회원가입</button>
      <button @click="backHome" class="btn btn-danger btn-block mb-4 mx-2">뒤로가기</button>
    </form>
  </div>
  <setToast v-if="showToast" :message="toastMessage" :type="toastStatus" />
</template>

<script>
import { reactive } from '@vue/reactivity';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsExports from '@/aws-exports';
import { createUserData } from '@/graphql/mutations';
import { useRouter } from 'vue-router';
import setToast from '@/components/setToast.vue';
import { useToast } from '@/hooks/toast';
Amplify.configure(awsExports);

export default {
  components: {
    setToast
  },
  setup() {
    const { showToast, toastMessage, toastStatus, showToastChange } = useToast();
    const userInfo = reactive({
      username: "",
      account: "",
      password: "",
      state: false
    });
    const router = useRouter();
    const submitBtn = async () => {
      if (/[0-9]/.test(userInfo.username)) {
        showToastChange("이름에 허용되지 않은 값이 있습니다.", "danger");
      } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(userInfo.account)) {
        showToastChange("아이디에 한글이 있습니다.", "danger");
      }
      if (!/[0-9]/.test(userInfo.username) && !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(userInfo.account) && userInfo.username && userInfo.account.length >= 4 && userInfo.password.length >= 4) {
        try {
          setTimeout(() => {
            showToastChange("존재하는 아이디 입니다.", "danger");
          }, 200);
          await API.graphql(graphqlOperation(createUserData, { input: { id: userInfo.account, ...userInfo } }));
          router.push({
            name: "Home",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
      // showToastChange("모든 값은 필수 입니다.", "danger");
    }
  }
  const backHome = () => {
      router.push({
        name: "Home",
      })
  }

    return {
      userInfo,
      submitBtn,
      backHome,
      showToast,
      toastMessage,
      toastStatus
    }
  }
}
</script>

<style>

</style>