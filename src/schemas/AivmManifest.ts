
import { z } from 'zod';

import { DEFAULT_ICON_DATA_URL } from '@/schemas/AivmManifestConstants';
import { StyleBertVITS2HyperParameters } from '@/schemas/StyleBertVITS2';
import Utils from '@/utils/Utils';


/* AIVM ファイルに含まれる全てのメタデータのシリアライズ後の型 */
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
    // 音声合成モデルの名前
    name: z.string().min(1),
    // 音声合成モデルの説明 (省略時は空文字列になる)
    description: z.string().default(''),
    // 音声合成モデルの利用規約 (Markdown 形式 / 省略時は空文字列になる)
    terms_of_use: z.string().default(''),
    // 音声合成モデルのアーキテクチャ (音声合成技術の種類)
    model_architecture: z.union([z.literal('Style-Bert-VITS2'), z.literal('Style-Bert-VITS2 (JP-Extra)')]),
    // 音声合成モデルを一意に識別する UUID
    uuid: z.string().uuid(),
    // 音声合成モデルのバージョン (SemVer 2.0 準拠 / ex: 1.0.0)
    version: z.string().regex(Utils.SEMVER_REGEX),
    // 音声合成モデルの話者情報 (最低 1 人以上の話者が必要)
    speakers: z.array(z.object({
        // 話者の名前
        name: z.string().min(1),
        // 話者の対応言語のリスト (ja, en, zh のような ISO 639-1 言語コード)
        supported_languages: z.array(z.string().length(2)),
        // 話者を一意に識別する UUID
        uuid: z.string().uuid(),
        // 話者のローカル ID (この音声合成モデル内で話者を識別するための一意なローカル ID で、uuid とは異なる)
        local_id: z.number().int().nonnegative(),
        // 話者のバージョン (SemVer 2.0 準拠 / ex: 1.0.0)
        version: z.string().regex(Utils.SEMVER_REGEX),
        // 話者のスタイル情報 (最低 1 つ以上のスタイルが必要)
        styles: z.array(z.object({
            // スタイルの名前
            name: z.string().min(1),
            // スタイルのアイコン画像 (Data URL)
            // 最初のスタイルのアイコン画像が話者単体のアイコン画像として使用される
            icon: z.string(),
            // スタイルのボイスサンプル (省略時は空配列になる)
            voice_samples: z.array(z.object({
                // ボイスサンプルの音声ファイル (Data URL)
                audio: z.string(),
                // ボイスサンプルの書き起こし文
                transcript: z.string(),
            })),
            // スタイルの ID (この話者内でスタイルを識別するための一意なローカル ID で、uuid とは異なる)
            local_id: z.number().int().min(0).max(31),
        })),
    })),
});

/* デフォルト表示用の AIVM マニフェスト */
export const DefaultAivmManifest: AivmManifest = {
    manifest_version: '1.0',
    name: 'Model Name',
    description: '',
    terms_of_use: '',
    model_architecture: 'Style-Bert-VITS2 (JP-Extra)',
    uuid: '00000000-0000-0000-0000-000000000000',
    version: '1.0.0',
    speakers: [{
        name: 'Speaker Name',
        supported_languages: ['ja'],
        uuid: '00000000-0000-0000-0000-000000000000',
        local_id: 0,
        version: '1.0.0',
        styles: [{
            name: 'ノーマル',
            icon: DEFAULT_ICON_DATA_URL,
            voice_samples: [],
            local_id: 0,
        }],
    }],
};
