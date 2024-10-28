
import { z } from 'zod';

import { DEFAULT_ICON_DATA_URL } from '@/schemas/AivmManifestConstants';
import { StyleBertVITS2HyperParameters } from '@/schemas/StyleBertVITS2';
import Utils from '@/utils';


export const ModelArchitectureSchema = z.enum([
    'Style-Bert-VITS2',  // 対応言語: "ja", "en-US", "zh-CN"
    'Style-Bert-VITS2 (JP-Extra)',  // 対応言語: "ja"
]);

export const ModelFormatSchema = z.enum([
    'Safetensors',
    'ONNX',
]);


/* AIVM / AIVMX ファイルに含まれる全てのメタデータのシリアライズ後の型 */
export type AivmMetadata = {
    // AIVM マニフェストの情報
    manifest: AivmManifest,
    // ハイパーパラメータの情報
    hyper_parameters: StyleBertVITS2HyperParameters,
    // スタイルベクトルの情報
    style_vectors?: Uint8Array,
};


/* AIVM マニフェストの型 */
export type AivmManifest = z.infer<typeof AivmManifestSchema>;

/* AIVM マニフェストのスキーマ */
export const AivmManifestSchema = z.object({
    // AIVM マニフェストのバージョン (ex: 1.0)
    // 現在は 1.0 のみサポート
    manifest_version: z.string().regex(/^1\.0$/),
    // 音声合成モデルの名前 (最大 80 文字)
    // 音声合成モデル内の話者が 1 名の場合は話者名と同じ値を設定すべき
    name: z.string().min(1).max(80),
    // 音声合成モデルの簡潔な説明 (最大 140 文字 / 省略時は空文字列を設定)
    description: z.string().max(140).default(''),
    // 音声合成モデルの作成者名のリスト (省略時は空リストを設定)
    // 作成者名には npm package.json の "author", "contributors" に指定できるものと同じ書式を利用できる
    // 例: ["John Doe", "Jane Doe <jane.doe@example.com>", "John Doe <john.doe@example.com> (https://example.com)"]
    creators: z.array(z.string().min(1).max(255)).default([]),
    // 音声合成モデルのライセンス情報 (Markdown 形式またはプレーンテキスト / 省略時は null を設定)
    // AIVM 仕様に対応するソフトでライセンス情報を表示できるよう、Markdown 形式またはプレーンテキストでライセンスの全文を設定する想定
    // 社内のみでの利用など、この音声合成モデルの公開・配布を行わない場合は null を設定する
    license: z.string().min(1).nullable().default(null),
    // 音声合成モデルのアーキテクチャ (音声合成技術の種類)
    model_architecture: ModelArchitectureSchema,
    // 音声合成モデルのモデル形式 (Safetensors または ONNX)
    // AIVM ファイル (.aivm) のモデル形式は Safetensors 、AIVMX ファイル (.aivmx) のモデル形式は ONNX である
    model_format: ModelFormatSchema,
    // 音声合成モデル学習時のエポック数 (省略時は null を設定)
    training_epochs: z.number().int().nonnegative().nullable().default(null),
    // 音声合成モデル学習時のステップ数 (省略時は null を設定)
    training_steps: z.number().int().nonnegative().nullable().default(null),
    // 音声合成モデルを一意に識別する UUID
    uuid: z.string().uuid(),
    // 音声合成モデルのバージョン (SemVer 2.0 準拠 / ex: 1.0.0)
    version: z.string().regex(Utils.SEMVER_REGEX),
    // 音声合成モデルの話者情報 (最低 1 人以上の話者が必要)
    speakers: z.array(z.object({
        // 話者の名前 (最大 80 文字)
        // 音声合成モデル内の話者が 1 名の場合は音声合成モデル名と同じ値を設定すべき
        name: z.string().min(1).max(80),
        // 話者のアイコン画像 (Data URL)
        // 画像ファイル形式は 512×512 の JPEG (image/jpeg)・PNG (image/png) のいずれか (JPEG を推奨)
        icon: z.string().regex(/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/),
        // 話者の対応言語のリスト (BCP 47 言語タグ)
        // 例: 日本語: "ja", アメリカ英語: "en-US", 標準中国語: "zh-CN"
        supported_languages: z.array(z.string().regex(/^[a-z]{2,3}(?:-[A-Z]{4})?(?:-(?:[A-Z]{2}|\d{3}))?(?:-(?:[A-Za-z0-9]{5,8}|\d[A-Za-z0-9]{3}))*(?:-[A-Za-z](?:-[A-Za-z0-9]{2,8})+)*(?:-x(?:-[A-Za-z0-9]{1,8})+)?$/)),
        // 話者を一意に識別する UUID
        uuid: z.string().uuid(),
        // 話者のローカル ID (この音声合成モデル内で話者を識別するための一意なローカル ID で、uuid とは異なる)
        local_id: z.number().int().nonnegative(),
        // 話者のスタイル情報 (最低 1 つ以上のスタイルが必要)
        styles: z.array(z.object({
            // スタイルの名前 (最大 20 文字)
            name: z.string().min(1).max(20),
            // スタイルのアイコン画像 (Data URL, 省略可能)
            // 省略時は話者のアイコン画像がスタイルのアイコン画像として使われる想定
            // 画像ファイル形式は 512×512 の JPEG (image/jpeg)・PNG (image/png) のいずれか (JPEG を推奨)
            icon: z.string().regex(/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/).nullable().default(null),
            // スタイルの ID (この話者内でスタイルを識別するための一意なローカル ID で、uuid とは異なる)
            local_id: z.number().int().min(0).max(31),  // 最大 32 スタイルまでサポート
            // スタイルごとのボイスサンプル (省略時は空リストを設定)
            voice_samples: z.array(z.object({
                // ボイスサンプルの音声ファイル (Data URL)
                // 音声ファイル形式は WAV (audio/wav, Codec: PCM 16bit)・M4A (audio/mp4, Codec: AAC-LC) のいずれか (M4A を推奨)
                audio: z.string().regex(/^data:audio\/(wav|mp4);base64,[A-Za-z0-9+/=]+$/),
                // ボイスサンプルの書き起こし文
                // 書き起こし文は音声ファイルでの発話内容と一致している必要がある
                transcript: z.string().min(1),
            })).default([]),
        })),
    })),
});


/* デフォルト表示用の AIVM マニフェスト */
export const DefaultAivmManifest: AivmManifest = {
    manifest_version: '1.0',
    name: 'Model Name',
    description: '',
    creators: [],
    license: null,
    model_architecture: 'Style-Bert-VITS2 (JP-Extra)',
    model_format: 'Safetensors',
    training_epochs: null,
    training_steps: null,
    uuid: '00000000-0000-0000-0000-000000000000',
    version: '1.0.0',
    speakers: [{
        name: 'Speaker Name',
        icon: DEFAULT_ICON_DATA_URL,
        supported_languages: ['ja'],
        uuid: '00000000-0000-0000-0000-000000000000',
        local_id: 0,
        styles: [{
            name: 'ノーマル',
            icon: null,
            local_id: 0,
            voice_samples: [],
        }],
    }],
};
