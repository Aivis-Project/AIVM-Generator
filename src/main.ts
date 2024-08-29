
import { Icon } from '@iconify/vue';
import 'floating-vue/dist/style.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import FloatingVue from '@/plugins/floating-vue';
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

// FloatingVue を使う
// タッチデバイスでは無効化する
// ref: https://v-tooltip.netlify.app/guide/config#default-values
FloatingVue.options.themes.tooltip.triggers = Utils.isTouchDevice() ? [] : ['hover', 'focus', 'touch'];
FloatingVue.options.themes.tooltip.delay.show = 0;
FloatingVue.options.offset = [0, 7];
app.use(FloatingVue);

// マウントを実行
app.mount('#app');
