<template>
    <v-app id="app">
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
        <Snackbars />
    </v-app>
</template>
<script lang="ts" setup>

import Snackbars from '@/components/Snackbars.vue';

</script>
<style lang="scss">

// ***** ブラウザのデフォルトスタイルの上書き *****

// スクロールバーのスタイル
// なるべく ::webkit-scrollbar を優先させるため、::webkit-scrollbar 未対応の Firefox でのみ scrollbar-color/width を有効化する
@supports (-moz-appearance: none) {
    * {
        scrollbar-color: rgb(var(--v-theme-background-lighten-3)) rgb(var(--v-theme-background));
        scrollbar-width: thin;
    }
}
::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}
::-webkit-scrollbar-track {
    background: rgb(var(--v-theme-background));
}
::-webkit-scrollbar-thumb {
    background: rgb(var(--v-theme-background-lighten-2));
    &:hover {
        background: rgb(var(--v-theme-background-lighten-3));
    }
}

// Android でタップしたときのハイライトが出ないようにする
* {
    -webkit-tap-highlight-color: transparent;
}

// 選択時の色
*::selection {
	background-color: #41a2ec80;
}

// リンクの既定の CSS をリセット
a, a:link, a:visited, a:hover, a:active {
    color: inherit;
    text-decoration: none;
}

// ***** SPA 全体に適用されるスタイル *****

// ページ遷移アニメーション (View Transitions API)
// ref: https://developer.mozilla.org/ja/docs/Web/API/View_Transitions_API
::view-transition-old(root),
::view-transition-new(root) {
    animation-duration: 0.25s;  // 0.25 秒クロスフェード
}

// 全体のスタイル
:root {
    font-size: 14px;
}
html {
    overflow-y: auto !important;
    touch-action: manipulation;

    // scrollbar-gutter: stable を指定すると、overflow: hidden 指定時にもスクロールバー分の領域が確保される
    // もっと早くに知りたかった…
    // ref: https://ics.media/entry/230206/
    scrollbar-gutter: stable;

    // Vuetify 3 では position: fixed でモーダル表示時のスクロールを防止しようとしているが、これだとレイアウトがぶっ壊れるので使えない
    // そのため position を static に固定して、代わりに overflow: hidden でスクロールを防止する
    // iOS 16 から Safari でも overflow: hidden でスクロールを防止できるようになったため問題ない
    // ref: https://zenn.dev/lclco/articles/f5b20817a15b9a
    &.v-overlay-scroll-blocked {
        position: static !important;
        overflow: hidden !important;
    }
}

/* body {
    background: linear-gradient(130deg, hsl(206, 69%, 23%) 0%, rgba(42, 46, 51, 1) 100%) !important;
} */

// アプリケーションのルート
.v-application {
    max-width: 1010px;
    min-height: 100vh;
    min-height: 100dvh;
    margin-left: auto;
    margin-right: auto;
    font-family: 'LINE Seed JP', 'Twemoji', sans-serif;
    font-size: 14px;
    font-weight: 500;
    /* overflow-x: clip;  // clip なら position: sticky; が効く */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: rgba(var(--v-theme-background), 0.5) !important;
    color: rgb(var(--v-theme-text)) !important;

    // Safari は Twemoji COLR をうまく描画できない？ので当面無効にする
    @supports (-webkit-touch-callout: none) {
        font-family: 'LINE Seed JP', sans-serif;
    }
}

// メインコンテナ
// 各ページのルート要素は必ず <main> にする必要がある
// スタイルは各レイアウトにて一部上書きされる
main {
    min-height: 100%;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 36px;
}

// ツールチップのスタイル
.v-popper--theme-tooltip {
    .v-popper__inner {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 4px;
        background: rgb(var(--v-theme-background-lighten-1));
        color: rgb(var(--v-theme-text));
        font-size: 11px;
        font-family: 'LINE Seed JP', 'Twemoji', sans-serif;
        font-weight: 500;
        opacity: 0.9;
        line-height: 22px;
    }
    .v-popper__arrow-container {
        display: none;
    }
}

// ***** Vuetify 3 のスタイルの上書き *****

// font-weight を 400 から 500 に変更
.v-list-item-title {
    font-weight: 500 !important;
}
.v-input, .v-input__details {
    font-weight: 500 !important;
}

// カードテキストのテキストスタイルを Vuetify 2 に合わせる
.v-card-text {
    color: rgb(var(--v-theme-text-darken-1)) !important;
    font-size: .875rem !important;
    font-weight: inherit !important;
    line-height: 1.375rem !important;
    letter-spacing: .0071428571em !important;
}

// オーバーレイのスタイルを Vuetify 2 に合わせる (既定の --v-theme-on-surface では明るすぎる)
.v-overlay-container {
    font-family: 'LINE Seed JP', 'Twemoji', sans-serif;
    font-weight: 500;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: rgb(var(--v-theme-text)) !important;
}
.v-overlay__scrim {
    background: rgb(33, 33, 33) !important;
    opacity: 0.46 !important;
}

// スマホ縦画面でのダイヤログの表示幅を広げる
.v-dialog .v-overlay__content {
    @include smartphone {
        margin: 24px 6px !important;
        width: calc(100% - 12px) !important;
        max-width: calc(100% - 12px) !important;
        &--fullscreen {
            margin: 0 !important;
        }
    }
}

// ボタン内のテキストの字間をオフ
// 大文字への強制変換をオフ
.v-btn {
    letter-spacing: 0 !important;
    text-transform: none !important;
}

// ボタンに hover したときの transition が効かなくなっている Vuetify 3 のバグを打ち消す
// ref: https://github.com/vuetifyjs/vuetify/blob/v3.4.9/packages/vuetify/src/components/VBtn/VBtn.sass#L233
.v-btn__overlay {
    transition: opacity 0.2s ease-in-out;
}

// タッチデバイスでボタンへの hover を無効にする
@media (hover: none) {
    .v-btn:hover > .v-btn__overlay {
        opacity: 0 !important;
    }
}

// テキスト入力フォーム/セレクトボックスのボーダーの色を Vuetify 2 に合わせる
.v-field__outline {
    --v-field-border-opacity: 0.25 !important;
}
.v-field:hover .v-field__outline {
    --v-field-border-opacity: 0.5 !important;
}
.v-field.v-field--focused .v-field__outline {
    --v-field-border-opacity: 1 !important;
}

// テキスト入力フォーム/セレクトボックスの density が compact のときのフォントサイズを Vuetify 2 に合わせる
.v-input--density-compact {
    input, .v-field {
        font-size: 14px !important;
    }
}

// スライダーのつまみのラベルの色を Vuetify 2 に合わせる
.v-slider-thumb__label {
    background: rgb(var(--v-theme-primary)) !important;
    color: rgb(var(--v-theme-text)) !important;
    &:before {
        color: rgb(var(--v-theme-primary)) !important;
    }
}

// Progress Circular (indeterminate) のスタイルとアニメーション速度を Vuetify 2 に合わせる
.v-progress-circular--indeterminate {
    svg {
        .v-progress-circular__underlay {
            display: none !important;
        }
        .v-progress-circular__overlay {
            animation: progress-circular-dash 1.4s ease-in-out infinite !important;
        }
    }
}

// ***** ユーティリティクラス *****

// リンク用のスタイル
.link {
    color: rgb(var(--v-theme-primary)) !important;
    text-decoration: underline !important;
    cursor: pointer;

    &:visited {
        color: rgb(var(--v-theme-primary-darken-1)) !important;
    }
}

// スマホ縦画面 (幅が 600px 以下の端末) のみ表示する <br> タグ
.br-smartphone-only {
    display: none;
    @include smartphone {
        display: inline;
    }
}

// カーソルをポインターにする
.cursor-pointer {
    cursor: pointer;
}

</style>