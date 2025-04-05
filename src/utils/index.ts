import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { toRaw } from 'vue';


/**
 * 共通ユーティリティ
 */
export default class Utils {

    // semver の正規表現
    // ref: https://semver.org/lang/ja/
    static readonly SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;


    /**
     * Blob または File オブジェクトを Data URL に変換する
     * @param file Blob または File オブジェクト
     * @returns Data URL を返す Promise
     */
    static async blobToDataURL(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('ファイルの読み込み中にエラーが発生しました。'));
            reader.readAsDataURL(blob);
        });
    }


    /**
     * Blob に格納されているデータをブラウザにダウンロードさせる
     * @param blob Blob オブジェクト
     * @param filename 保存するファイル名
     */
    static downloadBlobData(blob: Blob, filename: string): void {

        // Blob URL を発行
        const blob_url = URL.createObjectURL(blob);

        // 画像をダウンロード
        const link = document.createElement('a');
        link.download = filename;
        link.href = blob_url;
        link.click();

        // Blob URL を破棄
        URL.revokeObjectURL(blob_url);
    }


    /**
     * 画像ファイルを正方形にクロップし、512×512 の JPEG 画像ファイルに変換する
     * @param file File 画像ファイル
     * @returns Promise<File> クロップ・リサイズされた画像ファイルを返す Promise
     */
    static async cropImageToSquare(file: File): Promise<File> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        reject(new Error('Canvas context could not be obtained.'));
                        return;
                    }

                    const size = Math.min(img.width, img.height);
                    const offsetX = (img.width - size) / 2;
                    const offsetY = (img.height - size) / 2;

                    // キャンバスサイズを512×512に設定
                    canvas.width = 512;
                    canvas.height = 512;

                    // 背景を白で塗りつぶし
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, 512, 512);

                    // 画像を正方形にクロップし、512×512にリサイズ
                    ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 512, 512);

                    // JPEG に変換して Blob 化 (品質: 98)
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                        } else {
                            reject(new Error('Blob could not be created.'));
                        }
                    }, 'image/jpeg', 0.98);
                };
                img.onerror = () => reject(new Error('Image could not be loaded.'));
                img.src = reader.result as string;
            };
            reader.onerror = () => reject(new Error('File could not be read.'));
            reader.readAsDataURL(file);
        });
    }


    /**
     * 音声ファイルを M4A (AAC) にエンコードして Data URL として返す
     * @param file 音声ファイル
     * @param ffmpeg FFmpeg インスタンス（既にロード済みであること）
     * @param options エンコードオプション
     * @returns エンコードされた音声ファイルの Data URL を返す Promise
     */
    static async encodeAudioToM4ADataURL(
        file: File,
        ffmpeg: FFmpeg,
        options: {
            bitrate?: string, // ビットレート（例: '256k'）
            onProgress?: (progress: number) => void, // 進捗コールバック
        } = {},
    ): Promise<string> {

        // オプションのデフォルト値
        const bitrate = options.bitrate || '256k';

        // ファイル名を生成（元の拡張子を維持）
        const inputFilename = `input.${file.name.split('.').pop() || 'bin'}`; // input.wav, input.mp3 など
        const outputFilename = 'output.m4a';

        try {
            // ファイルを ffmpeg に書き込む
            await ffmpeg.writeFile(inputFilename, await fetchFile(file));

            // M4A (AAC) にエンコード
            await ffmpeg.exec([
                '-i', inputFilename,
                '-vn',
                '-c:a', 'aac',
                '-aac_coder', 'twoloop',
                '-b:a', bitrate,
                '-ar', '44100',
                outputFilename
            ]);

            // エンコードされたファイルを読み込む
            const data = await ffmpeg.readFile(outputFilename);

            // エンコードされたファイルを Blob (MIME: audio/mp4) に変換
            const blob = new Blob([(data as Uint8Array).buffer], { type: 'audio/mp4' });

            // 一時ファイルを削除
            await ffmpeg.deleteFile(inputFilename);
            await ffmpeg.deleteFile(outputFilename);

            // Blob から Data URL に変換
            return await Utils.blobToDataURL(blob);
        } catch (ex) {
            console.error('Failed to encode audio:', ex);
            if (ex instanceof Error) {
                throw new Error(`音声ファイルのエンコードに失敗しました: ${ex.message}`);
            } else {
                throw new Error(`音声ファイルのエンコードに失敗しました: ${ex}`);
            }
        }
    }


    /**
     * 表示端末がタッチデバイスかどうか (モバイルデバイスかどうかは問わない)
     * おそらく Windows タブレットや Chromebook なども含まれる
     * @returns タッチデバイスなら true を返す
     */
    static isTouchDevice(): boolean {
        return window.matchMedia('(hover: none)').matches;
    }


    /**
     * ファイル選択ダイアログを開き、選択されたファイルを File オブジェクトとして取得する
     * @param accept ファイルの MIME タイプを指定する文字列 (例: 'image/*' など)
     * @returns 選択されたファイルを返す (ファイルが選択されなかった場合は null を返す)
     */
    static async selectFile(accept: string = ''): Promise<File | null> {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;

            // ファイルが選択されたときのイベントリスナー
            input.onchange = (event: Event) => {
                const target = event.target as HTMLInputElement;
                if (target.files && target.files.length > 0) {
                    resolve(target.files[0]);  // 最初のファイルを返す
                } else {
                    resolve(null);  // ファイルが選択されなかった場合
                }
            };

            // ファイルの選択がキャンセルされたときのイベントリスナー
            // つい最近になって <input type="file"> に oncancel イベントが追加されたらしい
            // ref: https://stackoverflow.com/a/76926836/17124142
            input.oncancel = () => {
                resolve(null);
            };

            // エラーハンドリング
            input.onerror = () => {
                reject(new Error('ファイル選択ダイアログの表示中にエラーが発生しました。'));
            };

            // ダイアログを開く
            input.click();
        });
    }


    /**
     * async/await でスリープ的なもの
     * @param seconds 待機する秒数 (ミリ秒単位ではないので注意)
     * @returns Promise を返すので、await sleep(1); のように使う
     */
    static async sleep(seconds: number): Promise<number> {
        return await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }


    /**
     * オブジェクトを再帰的に toRaw() して返す
     * ref: https://stackoverflow.com/a/77022014/17124142
     * @param observed オブジェクト
     * @returns 再帰的に toRaw() したオブジェクト
     */
    static toRawDeep<T>(observed: T): T {
        const val = toRaw(observed);

        // null チェック
        if (val === null) return null as T;

        // TypedArray (Uint8Array など) のチェック
        if (ArrayBuffer.isView(val) && !(val instanceof DataView)) {
            // TypedArray はそのまま返す（コピーしない）
            return val;
        }

        // 配列の処理
        if (Array.isArray(val)) {
            return val.map(Utils.toRawDeep) as T;
        }

        // 通常のオブジェクトの処理
        if (typeof val === 'object') {
            const entries = Object.entries(val).map(([key, val]) => [key, Utils.toRawDeep(val)]);
            return Object.fromEntries(entries);
        }

        return val;
    }
}
