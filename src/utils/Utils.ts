
/**
 * 共通ユーティリティ
 */
export default class Utils {

    // semver の正規表現
    // ref: https://semver.org/lang/ja/
    static readonly SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;


    /**
     * async/await でスリープ的なもの
     * @param seconds 待機する秒数 (ミリ秒単位ではないので注意)
     * @returns Promise を返すので、await sleep(1); のように使う
     */
    static async sleep(seconds: number): Promise<number> {
        return await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}
