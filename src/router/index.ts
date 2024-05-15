
import { createRouter, createWebHistory } from 'vue-router';


// Vue Router v4
// ref: https://router.vuejs.org/guide/

const router = createRouter({

    // ルーティングのベース URL
    history: createWebHistory(import.meta.env.BASE_URL),

    // ルーティング設定
    routes: [
        {
            path: '/',
            name: 'Root',
            component: () => import('@/layouts/Default.vue'),
            children: [
                {
                    path: '',
                    name: 'Main',
                    component: () => import('@/views/Main.vue'),
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/NotFound.vue'),
        },
    ],

    // ページ遷移時のスクロールの挙動の設定
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            // 戻る/進むボタンが押されたときは保存されたスクロール位置を使う
            return savedPosition;
        } else {
            // それ以外は常に先頭にスクロールする
            return {top: 0, left: 0};
        }
    }
});

// ルーティングの変更時に View Transitions API を適用する
// ref: https://developer.mozilla.org/ja/docs/Web/API/View_Transitions_API
router.beforeResolve((to, from, next) => {
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            next();
        });
    } else {
        next();
    }
});

export default router;
