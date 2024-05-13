
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';


// Vite の設定
// https://vitejs.dev/config/
export default defineConfig({
    define: {
        'process.env': {},  // これがないと assert がエラーになる
    },
    // ビルドの設定
    build: {
        chunkSizeWarningLimit: 3 * 1024 * 1024,  // 3MB に緩和
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    // フォントファイルのみ、ハッシュを付けずに assets/fonts/ に出力する
                    if (['.ttf', '.eot', '.woff', '.woff2'].some((ext) => assetInfo.name?.endsWith(ext))) {
                        return 'assets/fonts/[name][extname]';
                    }
                    return 'assets/[name].[hash][extname]';
                },
            },
        },
    },
    resolve: {
        alias: {'@': fileURLToPath(new URL('./src', import.meta.url))},
        extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    // SASS / SCSS の設定
    css: {
        preprocessorOptions: {
            scss: {
                // 共通の mixin を読み込む
                // ref: https://qiita.com/nanohanabuttobasu/items/f73ed978cc10d8bcaa59
                additionalData: '@import "./src/styles/mixin.scss";',
            },
        },
    },
    // 開発用サーバーの設定
    server: {
        host: '0.0.0.0',
        port: 3000,
        strictPort: true,
    },
    preview: {
        host: '0.0.0.0',
        port: 3000,
        strictPort: true,
    },
    // プラグインの設定
    plugins: [
        vue({
            template: {
                transformAssetUrls: transformAssetUrls,
            },
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        vuetify({
            autoImport: true,
            styles: {
                configFile: 'src/styles/settings.scss',
            }
        }),
    ],
});
