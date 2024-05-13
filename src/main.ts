
import { Icon } from '@iconify/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import Message from '@/message';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import Utils from '@/utils';


// ***** Vue アプリケーションの初期化 *****

// Vue アプリケーションを作成
const app = createApp(App);

// Iconify (アイコン) のグローバルコンポーネントを登録
app.component('Icon', Icon);

// Pinia を使う
// ref: https://pinia.vuejs.org/cookbook/options-api.html
app.use(createPinia());

// Vue Router を使う
app.use(router);

// Vuetify を使う
app.use(vuetify);

// マウントを実行
app.mount('#app');
