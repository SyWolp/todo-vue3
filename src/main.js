import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import store from '@/store';
Amplify.configure(awsExports);

createApp(App).use(store).use(router).mount('#app')
