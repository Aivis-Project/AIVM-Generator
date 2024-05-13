
import Message from '@/message';
import { AivmManifest, DefaultAivmManifest } from '@/schemas/AivmManifest';
import { StyleBertVITS2HyperParameters, StyleBertVITS2HyperParametersSchema } from '@/schemas/StyleBertVITS2';


/**
 * AIVM フォーマット関連のユーティリティ
 */
export default class AivmUtils {


    /**
     * ハイパーパラメータファイルから AIVM マニフェストを生成する
     * @param model_architecture モデルアーキテクチャ
     * @param hyper_parameters_file ハイパーパラメータファイル
     */
    static async generateAivmManifest(
        model_architecture: AivmManifest['model_architecture'],
        hyper_parameters_file: File,
    ): Promise<AivmManifest> {

        // Style-Bert-VITS2 系の音声合成モデルの場合
        if (model_architecture.startsWith('Style-Bert-VITS2')) {

            // ハイパーパラメータファイル (JSON) を読み込んだ後、Zod でバリデーションする
            const file_content = await hyper_parameters_file.text();
            let hyper_parameters: StyleBertVITS2HyperParameters;
            try {
                hyper_parameters = StyleBertVITS2HyperParametersSchema.parse(JSON.parse(file_content));
            } catch (error) {
                Message.error(`${model_architecture} のハイパーパラメータファイルの形式が正しくありません。`);
                throw error;
            }

            // デフォルトの AIVM マニフェストをコピーした後、ハイパーパラメータに記載の値で一部を上書きする
            const manifest = structuredClone(DefaultAivmManifest);
            manifest.name = hyper_parameters.model_name;
            manifest.model_architecture = model_architecture;

            // spk2id の内容を反映
            manifest.speakers = Object.keys(hyper_parameters.data.spk2id).map((speaker_name, speaker_index) => {
                return {
                    name: speaker_name,
                    supported_languages: ['ja'],
                    uuid: '00000000-0000-0000-0000-000000000000',
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

            return manifest;
        }

        throw new Error(`Model architecture "${model_architecture}" is not supported.`);
    }
}
