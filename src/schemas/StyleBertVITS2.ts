
import { z } from 'zod';


/* Style-Bert-VITS2 のハイパーパラメータの型 */
export type StyleBertVITS2HyperParameters = z.infer<typeof StyleBertVITS2HyperParametersSchema>;

/**
 * Style-Bert-VITS2 のハイパーパラメータのスキーマ
 * 学習モデルの作成時期によって詳細なパラメータの有無が異なるため、実装上必須のパラメータ以外は optional としている
 * 以下は Style-Bert-VITS2 v2.4.1 のハイパーパラメータスキーマ定義を TypeScript 向けに改変したもの
 * ref: https://github.com/litagin02/Style-Bert-VITS2/blob/2.4.1/style_bert_vits2/models/hyper_parameters.py
 */
export const StyleBertVITS2HyperParametersSchema = z.object({
    model_name: z.string(),
    version: z.string(),
    train: z.object({
        log_interval: z.number().int().optional(),
        eval_interval: z.number().int().optional(),
        seed: z.number().int().optional(),
        epochs: z.number().int().optional(),
        learning_rate: z.number().optional(),
        betas: z.tuple([z.number(), z.number()]).optional(),
        eps: z.number().optional(),
        batch_size: z.number().int().optional(),
        bf16_run: z.boolean().optional(),
        fp16_run: z.boolean().optional(),
        lr_decay: z.number().optional(),
        segment_size: z.number().int().optional(),
        init_lr_ratio: z.number().int().optional(),
        warmup_epochs: z.number().int().optional(),
        c_mel: z.number().int().optional(),
        c_kl: z.number().optional(),
        c_commit: z.number().int().optional(),
        skip_optimizer: z.boolean().optional(),
        freeze_ZH_bert: z.boolean().optional(),
        freeze_JP_bert: z.boolean().optional(),
        freeze_EN_bert: z.boolean().optional(),
        freeze_emo: z.boolean().optional(),
        freeze_style: z.boolean().optional(),
        freeze_decoder: z.boolean().optional(),
    }),
    data: z.object({
        use_jp_extra: z.boolean().optional(),
        training_files: z.string().optional(),
        validation_files: z.string().optional(),
        max_wav_value: z.number().optional(),
        sampling_rate: z.number().int().optional(),
        filter_length: z.number().int().optional(),
        hop_length: z.number().int().optional(),
        win_length: z.number().int().optional(),
        n_mel_channels: z.number().int().optional(),
        mel_fmin: z.number().optional(),
        mel_fmax: z.number().nullable().optional(),
        add_blank: z.boolean().optional(),
        n_speakers: z.number().int(),
        cleaned_text: z.boolean().optional(),
        spk2id: z.record(z.string(), z.number().int()),
        num_styles: z.number().int(),
        style2id: z.record(z.string(), z.number().int()),
    }),
    model: z.object({
        use_spk_conditioned_encoder: z.boolean().optional(),
        use_noise_scaled_mas: z.boolean().optional(),
        use_mel_posterior_encoder: z.boolean().optional(),
        use_duration_discriminator: z.boolean().optional(),
        use_wavlm_discriminator: z.boolean().optional(),
        inter_channels: z.number().int().optional(),
        hidden_channels: z.number().int().optional(),
        filter_channels: z.number().int().optional(),
        n_heads: z.number().int().optional(),
        n_layers: z.number().int().optional(),
        kernel_size: z.number().int().optional(),
        p_dropout: z.number().optional(),
        resblock: z.string().optional(),
        resblock_kernel_sizes: z.array(z.number().int()).optional(),
        resblock_dilation_sizes: z.array(z.array(z.number().int())).optional(),
        upsample_rates: z.array(z.number().int()).optional(),
        upsample_kernel_sizes: z.array(z.number().int()).optional(),
        n_layers_q: z.number().int().optional(),
        use_spectral_norm: z.boolean().optional(),
        gin_channels: z.number().int().optional(),
        slm: z.object({
            model: z.string().optional(),
            sr: z.number().int().optional(),
            hidden: z.number().int().optional(),
            nlayers: z.number().int().optional(),
            initial_channel: z.number().int().optional(),
        }).optional(),
    }),
});
