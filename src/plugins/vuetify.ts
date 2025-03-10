
import 'vuetify/styles';
import '@/styles/materialdesignicons.min.css';
import { createVuetify } from 'vuetify';
import { ja } from 'vuetify/locale';


// ref: https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
    locale: {
        locale: 'ja',
        fallback: 'ja',
        messages: { ja },
    },
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                // ダークモード用テーマ
                // Vuetify 3 では light / dark 以外にも別のテーマを作成できるようになったため、
                // 明示的にダークモード用テーマかを指定する必要がある
                dark: true,
                // 下記で定義される配色は、CSS 変数から --v-theme-(配色名) で参照できる
                colors: {
                    // プライマリカラー・セカンダリカラー・アクセントカラー
                    // Vuetify 2 でベースカラーを元に自動生成されたカラーパレットを移植したもの
                    // 各 -lighten / -darken バリアントと accent は、Vuetify 3 のデフォルトカラーパレットには存在しない
                    'primary': '#41a2ec',
                    'secondary': '#41a2ec',
                    'accent': '#ff4081',
                    // Success / Warning / Error / Info
                    // Vuetify 2 のデフォルトのカラーパレットを移植したもの
                    // 各 -lighten / -darken バリアントは、Vuetify 3 のデフォルトカラーパレットには存在しない
                    'success': '#4caf50',
                    'success-lighten-5': '#dcffd6',
                    'success-lighten-4': '#beffba',
                    'success-lighten-3': '#a2ff9e',
                    'success-lighten-2': '#85e783',
                    'success-lighten-1': '#69cb69',
                    'success-darken-1': '#2d9437',
                    'success-darken-2': '#00791e',
                    'success-darken-3': '#006000',
                    'success-darken-4': '#004700',
                    'warning': '#fb8c00',
                    'warning-lighten-5': '#ffff9e',
                    'warning-lighten-4': '#fffb82',
                    'warning-lighten-3': '#ffdf67',
                    'warning-lighten-2': '#ffc24b',
                    'warning-lighten-1': '#ffa72d',
                    'warning-darken-1': '#db7200',
                    'warning-darken-2': '#bb5900',
                    'warning-darken-3': '#9d4000',
                    'warning-darken-4': '#802700',
                    'error': '#ff5252',
                    'error-lighten-5': '#ffe4d5',
                    'error-lighten-4': '#ffc6b9',
                    'error-lighten-3': '#ffa99e',
                    'error-lighten-2': '#ff8c84',
                    'error-lighten-1': '#ff6f6a',
                    'error-darken-1': '#df323b',
                    'error-darken-2': '#bf0025',
                    'error-darken-3': '#9f0010',
                    'error-darken-4': '#800000',
                    'info': '#2196f3',
                    'info-lighten-5': '#d4ffff',
                    'info-lighten-4': '#b5ffff',
                    'info-lighten-3': '#95e8ff',
                    'info-lighten-2': '#75ccff',
                    'info-lighten-1': '#51b0ff',
                    'info-darken-1': '#007cd6',
                    'info-darken-2': '#0064ba',
                    'info-darken-3': '#004d9f',
                    'info-darken-4': '#003784',
                    // Vuetify 3 のデフォルトカラーパレットの上書き
                    // surface / surface-* / on-* は、Vuetify 2 のデフォルトカラーパレットには存在しない
                    'surface': '#2a2e33',
                    'surface-bright': '#786968',
                    'surface-variant': '#786968',
                    'on-background': '#fbeeea',
                    'on-surface': '#fbeeea',
                    'on-surface-bright': '#fbeeea',
                    'on-primary': '#fbeeea',
                    'on-secondary': '#fbeeea',
                    'on-success': '#fbeeea',
                    'on-warning': '#fbeeea',
                    'on-error': '#fbeeea',
                    'on-info': '#fbeeea',
                    // AIVM Generator 独自定義のカラーパレット
                    // 上記までと異なり、すべてのバリアントが網羅されているわけではない (実際に使う色のみ定義されている)
                    'background': '#2a2e33',
                    'background-darken-1': '#202327',
                    'background-lighten-1': '#363a3f',
                    'background-lighten-2': '#3b3e43',
                    'background-lighten-3': '#484b51',
                    'text': '#fbeeea',
                    'text-darken-1': '#d2d3d4',
                    'text-darken-2': '#97999b',
                },
                // CSS 変数の定義
                variables: {
                    // 各透明度を Vuetify 2 に合わせる
                    'hover-opacity': 0.08,
                    'activated-opacity': 0.24,
                }
            }
        }
    }
});

export default vuetify;
