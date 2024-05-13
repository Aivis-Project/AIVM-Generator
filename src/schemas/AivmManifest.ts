
import { z } from 'zod';

import Utils from '@/utils';


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
        // 話者のローカル ID (この音声合成モデル内で一意な 0 から始まる連番で、uuid とは異なる)
        local_id: z.number().int().nonnegative(),
        // 話者のバージョン (SemVer 2.0 準拠 / ex: 1.0.0)
        version: z.string().regex(Utils.SEMVER_REGEX),
        // 話者のスタイル情報 (最低 1 つ以上のスタイルが必要)
        styles: z.array(z.object({
            // スタイルの名前
            name: z.string().min(1),
            // スタイルのアイコン画像 (Data URL)
            // 最初のスタイルのアイコン画像が話者のアイコン画像になる
            icon: z.string(),
            // スタイルのボイスサンプル (省略時は空配列になる)
            voice_samples: z.array(z.object({
                // ボイスサンプルの音声ファイル (Data URL)
                audio: z.string(),
                // ボイスサンプルのテキスト
                text: z.string().min(1),
            })),
            // スタイルの ID (この話者内で一意な 0 から始まる連番で、0 ~ 31 の範囲)
            local_id: z.number().int().min(0).max(31),
        })).nonempty(),
    })).nonempty(),
});

/* デフォルト表示用の AIVM マニフェスト */
export const DefaultAivmManifest: AivmManifest = {
    manifest_version: '1.0',
    name: 'Model Name',
    description: '',
    model_architecture: 'Style-Bert-VITS2 (JP-Extra)',
    terms_of_use: '',
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
            icon: '',
            voice_samples: [],
            local_id: 0,
        }],
    }],
};
