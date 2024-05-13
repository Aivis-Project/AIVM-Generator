
/**
 * 共通ユーティリティ
 */
export default class Utils {

    // バックエンドの API のベース URL
    // Worker からも参照できるように self.location を使う
    static readonly api_base_url = (() => {
        if (import.meta.env.DEV === true) {
            // デバッグ時はポートを 3100 に強制する
            return `${self.location.protocol}//${self.location.hostname}:3100/api`;
        } else {
            // ビルド後は同じポートを使う
            return `${self.location.protocol}//${self.location.host}/api`;
        }
    })();


    // semver の正規表現
    // ref: https://semver.org/lang/ja/
    static readonly SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;


    /**
     * バイト単位の数値をフォーマットする
     * @param bytes バイト数
     * @returns フォーマットされた文字列 (例: 1.23KB)
     */
    static formatBytes(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let unitIndex = 0;

        while (bytes >= 1000 && unitIndex < units.length - 1) {
            bytes /= 1000;
            unitIndex++;
        }

        return `${bytes.toFixed(2)}${units[unitIndex]}`;
    }


    /**
     * async/await でスリープ的なもの
     * @param seconds 待機する秒数 (ミリ秒単位ではないので注意)
     * @returns Promise を返すので、await sleep(1); のように使う
     */
    static async sleep(seconds: number): Promise<number> {
        return await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}