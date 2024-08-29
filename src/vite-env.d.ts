/// <reference types="vite/client" />

import { Icon } from '@iconify/vue';


declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// **** ライブラリの型定義 *****

// グローバルコンポーネントの型定義
// "@vue/runtime-core" ではなく "vue" の型を拡張しないとすべての型が壊れてしまう
// ref: https://github.com/nuxt/nuxt/pull/28542
declare module 'vue' {
    export interface GlobalComponents {
        Icon: typeof Icon;
    }
}

// ***** ブラウザの JavaScript API のうち、開発時点でマイナーすぎて @types が定義されていない API の型定義 *****

declare global {

    // location.reload() の forceReload 引数
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
    interface Location {
        reload(forceReload?: boolean): void;
    }

    // View Transitions API
    // ref: https://developer.mozilla.org/ja/docs/Web/API/View_Transitions_API
    interface Document {
        startViewTransition?: (callback: () => Promise<void> | void) => {
            finished: Promise<void>;
            updateCallbackDone: Promise<void>;
            ready: Promise<void>;
            skipTransition: () => void;
        }
    }
}
