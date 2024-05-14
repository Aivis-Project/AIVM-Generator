
import uuid from 'uuid';

import Message from '@/message';
import { AivmMetadata, AivmManifest, AivmManifestSchema, DefaultAivmManifest } from '@/schemas/AivmManifest';
import { StyleBertVITS2HyperParameters, StyleBertVITS2HyperParametersSchema } from '@/schemas/StyleBertVITS2';


/**
 * AIVM (Aivis Voice Model) 関連のユーティリティ
 *
 * AIVM は、Safetensors 形式の学習済み音声合成モデルのヘッダー領域の中に、カスタムメタデータとして
 * 話者メタデータ・ハイパーパラメータ・スタイルベクトルといった各種情報を JSON 文字列として格納したファイルフォーマットである。
 * Safetensors 形式の拡張仕様のため、そのまま通常の Safetensors ファイルとしてロードできる。
 * Safetensors 同様、先頭 8bytes の符号なし Little-Endian 64bit 整数がヘッダーサイズ、その後ろにヘッダーサイズの長さだけ UTF-8 の JSON 文字列が続く。
 * Safetensors のヘッダー JSON にはテンソルのオフセット等が格納されているが、"__metadata__" キーには string から string への map を自由に設定可能な仕様である。
 * この仕様を活用し、AIVM は "__metadata__" 内の以下のキーに次のデータを JSON シリアライズして格納する。
 * - "aivm_manifest": AIVM マニフェスト (マニフェストバージョンや話者メタデータを含む大半の情報が含まれる)
 * - "aivm_hyper_parameters": ハイパーパラメータ (フォーマットはモデルアーキテクチャの実装依存)
 * - "aivm_style_vectors": Base64 エンコードされたスタイルベクトル (フォーマットはモデルアーキテクチャの実装依存 / モデルアーキテクチャ次第では省略されうる)
 * ref: https://github.com/huggingface/safetensors
 * ref: https://huggingface.co/docs/safetensors/main/en/metadata_parsing
 */
export default class AivmUtils {


    /**
     * ハイパーパラメータファイルとスタイルベクトルファイルから AIVM メタデータを生成する
     * @param model_architecture 音声合成モデルのアーキテクチャ
     * @param hyper_parameters_file ハイパーパラメータファイル
     * @param style_vectors_file スタイルベクトルファイル
     */
    static async generateAivmMetadata(
        model_architecture: AivmManifest['model_architecture'],
        hyper_parameters_file: File,
        style_vectors_file: File | null,
    ): Promise<AivmMetadata> {

        // Style-Bert-VITS2 系の音声合成モデルの場合
        if (model_architecture.startsWith('Style-Bert-VITS2')) {

            // ハイパーパラメータファイル (JSON) を読み込んだ後、Zod でバリデーションする
            const hyper_parameters_content = await hyper_parameters_file.text();
            let hyper_parameters: StyleBertVITS2HyperParameters;
            try {
                hyper_parameters = StyleBertVITS2HyperParametersSchema.parse(JSON.parse(hyper_parameters_content));
            } catch (error) {
                Message.error(`${model_architecture} のハイパーパラメータファイルの形式が正しくありません。`);
                throw new Error('ハイパーパラメータファイルの形式が正しくありません。');
            }

            // スタイルベクトルファイルを読み込む（存在する場合）
            let style_vectors: Uint8Array | undefined;
            if (style_vectors_file) {
                const style_vectors_array_buffer = await style_vectors_file.arrayBuffer();
                style_vectors = new Uint8Array(style_vectors_array_buffer);
            }

            // デフォルトの AIVM マニフェストをコピーした後、ハイパーパラメータに記載の値で一部を上書きする
            const manifest = structuredClone(DefaultAivmManifest);
            manifest.name = hyper_parameters.model_name;
            manifest.model_architecture = model_architecture;
            manifest.uuid = uuid.v4();

            // spk2id の内容を反映
            manifest.speakers = Object.keys(hyper_parameters.data.spk2id).map((speaker_name, speaker_index) => {
                return {
                    name: speaker_name,
                    supported_languages: ['ja'],
                    uuid: uuid.v4(),
                    local_id: speaker_index,
                    version: '1.0.0',
                    // style2id の内容を反映
                    styles: Object.keys(hyper_parameters.data.style2id).map((style_name, style_index) => {
                        return {
                            name: style_name,
                            icon: '',
                            voice_samples: [],
                            local_id: style_index,
                        };
                    }),
                };
            });

            return {
                aivm_manifest: manifest,
                aivm_hyper_parameters: hyper_parameters,
                aivm_style_vectors: style_vectors,
            };
        }

        Message.error(`音声合成モデルアーキテクチャ ${model_architecture} には対応していません。`);
        throw new Error(`音声合成モデルアーキテクチャ ${model_architecture} には対応していません。`);
    }


    /**
     * AIVM ファイルから AIVM メタデータを読み込む
     * @param aivm_file AIVM ファイル
     * @returns AIVM メタデータ
     */
    static async loadAivmMetadata(aivm_file: File): Promise<AivmMetadata> {

        // ファイルの内容を読み込む
        const array_buffer = await aivm_file.arrayBuffer();
        const data_view = new DataView(array_buffer);

        // 先頭 8 バイトからヘッダーサイズを取得
        const header_size = data_view.getBigUint64(0, true);

        // ヘッダー部分を抽出
        const header_bytes = new Uint8Array(array_buffer, 8, Number(header_size));
        const header_text = new TextDecoder().decode(header_bytes);
        const header_json = JSON.parse(header_text);

        // "__metadata__" キーから AIVM メタデータを取得
        const metadata = header_json['__metadata__'];
        if (!metadata || !metadata['aivm_manifest']) {
            Message.error('AIVM マニフェストが見つかりません。');
            throw new Error('AIVM マニフェストが見つかりません。');
        }

        // AIVM マニフェストをパースしてバリデーション
        let aivm_manifest: AivmManifest;
        try {
            aivm_manifest = AivmManifestSchema.parse(JSON.parse(metadata['aivm_manifest']));
        } catch (error) {
            Message.error('AIVM マニフェストの形式が正しくありません。');
            throw new Error('AIVM マニフェストの形式が正しくありません。');
        }

        // ハイパーパラメータのバリデーション
        let aivm_hyper_parameters: StyleBertVITS2HyperParameters;
        if (metadata['aivm_hyper_parameters']) {
            try {
                if (aivm_manifest.model_architecture.startsWith('Style-Bert-VITS2')) {
                    aivm_hyper_parameters = StyleBertVITS2HyperParametersSchema.parse(JSON.parse(metadata['aivm_hyper_parameters']));
                } else {
                    Message.error(`モデルアーキテクチャ ${aivm_manifest.model_architecture} のハイパーパラメータには対応していません。`);
                    throw new Error(`モデルアーキテクチャ ${aivm_manifest.model_architecture} のハイパーパラメータには対応していません。`);
                }
            } catch (error) {
                Message.error('ハイパーパラメータの形式が正しくありません。');
                throw new Error('ハイパーパラメータの形式が正しくありません。');
            }
        } else {
            Message.error('ハイパーパラメータが見つかりません。');
            throw new Error('ハイパーパラメータが見つかりません。');
        }

        // スタイルベクトルのデコード
        let aivm_style_vectors: Uint8Array | undefined;
        if (metadata['aivm_style_vectors']) {
            try {
                const base64_string = metadata['aivm_style_vectors'];
                const binary_string = atob(base64_string);
                const len = binary_string.length;
                aivm_style_vectors = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    aivm_style_vectors[i] = binary_string.charCodeAt(i);
                }
            } catch (error) {
                Message.error('スタイルベクトルのデコードに失敗しました。');
                throw new Error('スタイルベクトルのデコードに失敗しました。');
            }
        }

        return {
            aivm_manifest,
            aivm_hyper_parameters,
            aivm_style_vectors,
        };
    }
}
