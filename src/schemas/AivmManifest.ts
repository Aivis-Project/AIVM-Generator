
import { z } from 'zod';

import { StyleBertVITS2HyperParameters } from '@/schemas/StyleBertVITS2';
import Utils from '@/utils/Utils';


/* デフォルトアイコンの Data URL */
export const DEFAULT_ICON_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAMAAAC3Ycb+AAACUlBMVEX/rDP19vX29O7+skP/rDT27+P19/j19vT+tUr45Mb/rzr44Lz358735sr/sDz7zIf+sD353bT19/f19PH/rTf9vmP/rjn+tk352qz19fP9uVb28+37zYr7yoP28eb61Z/7yX/7yHz7x3n7yoD448P8wGf7y4P28ef52677zoz60JL28OX8x3j53LH60ZP8v2b9vWD516P369n45cf/rTb+sD/44b7369f53bP19fL28OT8wGj9ulf8v2X61Jz52aj8xXX437j6z478wm360JH+sUH8xHH36tX+tk735sz44sH+sT/9uVT+sUD52Kf44sD43rb+tEj27uD36dL7zIb8w3D+s0b9vmH9vF76z5D7x3r526/7y4X37Nz60pj+tEf19fH61Z743rX60pf605n8wWr448L9vV/27dz8wm736NH8wWv9u1z9u1r+t1H28ej7yH319/b53bL45MX8wWn28Ob37Nr28uv52qr52ar36M/44r/61Jv8xHL7zIj9u1v27d3605r27uH+t0/8xnf+t1D+skL+s0f51qH36tb52qv358343rf+s0T9vF344b3369j+tkz9u1n60ZX+sD752Kb6zo3/rzz44b/6z4/36ND52KX29O/60pb9vFz+s0X27d78xnb7x3v7yX744Lr7zov605j516T45cj9uFP9uFH28+744Lv27+L9v2T/rzv7yoL1+Pn28en/rTX9vmL51qL28+z53LD9ulj36dT8w2/60pX9uVX8xnj35sv29PD27t/60ZT/rjj448T52q328uq2aPTaAAAH40lEQVR4XuzRtxHCQAAAQfrv5q2sN32RMwMBgZTsdnBzrz8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApHbamrlbY1y7udmmNj0WQMrDsYQPyzHkB6aw92cMX1xnv98awFhq+KmW8a4A3uzdd3MUVxYF8DOamZ5RzhEhISQkJBASRiYYk3M2LGAT1gTHnHPOOWzMOedw6AWDTRCD9L22ylS5WIxAI3XPvHvf/X2F80fX7ffueSPzKzgJFbNHED9TtneUkzS6twzxMrn+E8zDif4c4mPC+W8yT2/ODxET03iGU3CmEXEwybmcos+TiJpJdT/HKXuuO4VImWwpp6U0iwiZg3/nNJX8DlExG9YwAms2IBLmV2lGIn0HImCqE4xIohrTZaqWMkJLqzAtJvsBI7Uki2kwn/YxYn2fYsrM6lZGrnU1psisZSx+iqkwqU7GZGEKeTPhh4zN0hHkyeQ+Zoz+kUNeTNNWxurevBIxZT2M2a48EjG5HsaufNKJmNxiFsAfGjApJqxlQRwPMRlmFQtkFSbBrGfBrMcNmcdZQLNwA2ZfwAIK9uG6TNsFFlR9G67DJPewwP6ZxIRMrpIFdz6HiZgxFsFcTMC0syj+iGsy9yVYFIlhXINJplkk6SS+wYQ9LJqeEFcz32cRfYmrmKGARRQM4f+YbWkWVXobrmRqWWS1uIJ5m0V3Dl8z2RksuhlZXGaQKqUDSlO4zPTSCb34isleoBMuZGEAYCsd0QMD4BydcQ4GOx6jMx7bAbOKDllleZwO6JDgNDyXqqRTKlPw22w6Zja8VjWPjplXBZ+tpHNWwmPZDJ2TycJfc+kSu6e1PaCDgu3w1Wd00mfw1O101O3w03k66jy8tJzOeho+qqSzKuGhRjrsX/DPU3TYU/DOHXTaffDNS3TaLnhmOx33PfjlQzpuEF5JttJxiU/gk4t03kV4JNdB53Xk4I8uCtAFf5yhAGdsKCwS+wvfQhGehCeq6ilC67vww0wK0Q4/PEghPoAXbqUYr8EHP6QYO+GBhnGKMZ6Dfl9QkH3Q7zYKsgbqVS2jIK010G4+nWL7O+UUpRzK1SQoSuIH0G01hVkN3Z6kMEuhWniKwpxqgGZDFGcImp2kOAuh2SjFGYViZylQG/T6EQVaC716KNAlqFXWSoEyZbbm6ZZ7oNXLdIrV0XxEkSqgVE0dRaqrgU73UKiHoNOfKNSd0KmULrFJZGQZhSoJodFrFOssNDpMsbqh0SGKNQaNbqJY34FCPw4oVlAFfYYp2DD0qaZg1bZ6GzcrV/4ZBXsQ6qTqKdjRENo0U7Rm22RzyxfQZi1FOwBtxijamPVYx8u6rk9QtHEoU0PhaqzgxC2noctGCrcRurRTuH5bnXLLQms4ccvHNobEyd6lep3C/Qa6LKNwrVDlZop3MzT5G8X7KzSZQ/HmWG1ZfKzKbC/Fq4YmAxRvAJoco3jHoMkLFO8FaHKc4t0GTbZSvHuhSQXFq7BlHbfcBE3SFC8NASwQqU5RvBnQpITilUAAC0SqgPJBEwpggQiTsiP1uNihepUF4hgqUGaBuAWaZCifDYZuyUAAm9SlmkfxOiCAHVBJtYXifQRNFlO8n0CTQYo3CE3+TPF+Dk3upFOskX8mxZsJTdZRvHVWdeKWW6HJBor3rq1FOyUDXb5N4e6HLi9RuF3Q5X0K9z50mWljiFsaKVwjdPk1hdsPZWbYMoJbSinaImjTSdE6oc3bFO0ctHmHor0DbVIlFOwXKbjEvuql0OdLCvZL6LOCgq2APk0ZipUog0KV9r6OW+6mWHdDo/9SrCFoFJ6iUCUNUKmWQq2BTrMp1OPQaUNAkYJPoNR5a1t0SztFaodWRwIKFByBWoso0F+gVy8F6oVeyScozhNJKFZOccqh2QMU5wFoFqYpTDqEandRmLugWzagKEEWypXbJ90tK+x2g2M2UZBvQb8uCvJb6NeQphjpEXjgVYrxKnzQNI9CzGuCF6rt+Vu35NIUIZ2DJ3rtIMQtDfdTgNcb4I2NFGAjPFJqi9BuOR3QccFpeKWFjhuDX5LjdNp4Ei6xf4y/h29Si+iwRSl459EMnZV5FB5aT2eth4/CLXTUlhBe2nyBTqrfDE9100nd8Fa53fxxy7Y9dM6eHfDYIxk6JvMIvPYfK0x2zCE65RB81/QiHfJiGbx35BY645bdMGgroSNK2mAAPJSgExJP4yvmYEAHBAdxmcFhOuAwvmYGWHQDuII55ljbvnmDRfUGrmIWsIgu4hvMARbNAVyDmVXHoqjrxjWZdfUsgvp1mIB5uI8F1/cwJmS+u4kFtqQZ12H+fZwFVV6F6zNrAxZMMJDCjZg5HSyQjjmYBJNczIJYnMSkmFR1hrHLVKcwWeZsBWNWcRZ5MGH7UcboaHuI/JjmS4zNpWbkz7wyyliMvoIpMWUL6hm5+gVlmCrz3vN1jFTd8+9hOsxbgxFGUjf4FqbLbG5JMBKJls2Igtn/8jinbXzlfkTFNM2q4LRUzGpCpEzbyT5OUcfJNkTPhMt3PsO8PbNzeYiYmHC4cwnzsKRzOO40zO6ulmcD3lDwbEvXbhSGqWnsr92U4AQSm2r7G2v+104dGgEMAgEQjEWiEBgMlhnst4GmyjRAaekhArU3W8M9uuwtvY2Z09onao2zV8pztF5cCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPjjA2RcKs4WGfb6AAAAAElFTkSuQmCC';

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
                // ボイスサンプルのテキスト
                text: z.string().min(1),
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
            icon: DEFAULT_ICON_DATA_URL,
            voice_samples: [],
            local_id: 0,
        }],
    }],
};
