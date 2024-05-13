
import { z } from 'zod';


/* Style-Bert-VITS2 のハイパーパラメータの型 */
export type StyleBertVITS2HyperParameters = z.infer<typeof StyleBertVITS2HyperParametersSchema>;

/**
 * Style-Bert-VITS2 のハイパーパラメータのスキーマ
 * ref: https://github.com/litagin02/Style-Bert-VITS2/blob/master/style_bert_vits2/models/hyper_parameters.py
 */
export const StyleBertVITS2HyperParametersSchema = z.object({
    model_name: z.string(),
    version: z.string(),
    train: z.object({
        log_interval: z.number().int(),
        eval_interval: z.number().int(),
        seed: z.number().int(),
        epochs: z.number().int(),
        learning_rate: z.number(),
        betas: z.tuple([z.number(), z.number()]),
        eps: z.number(),
        batch_size: z.number().int(),
        bf16_run: z.boolean(),
        fp16_run: z.boolean(),
        lr_decay: z.number(),
        segment_size: z.number().int(),
        init_lr_ratio: z.number().int(),
        warmup_epochs: z.number().int(),
        c_mel: z.number().int(),
        c_kl: z.number(),
        c_commit: z.number().int(),
        skip_optimizer: z.boolean(),
        freeze_ZH_bert: z.boolean(),
        freeze_JP_bert: z.boolean(),
        freeze_EN_bert: z.boolean(),
        freeze_emo: z.boolean(),
        freeze_style: z.boolean(),
        freeze_decoder: z.boolean(),
    }),
    data: z.object({
        use_jp_extra: z.boolean(),
        training_files: z.string(),
        validation_files: z.string(),
        max_wav_value: z.number(),
        sampling_rate: z.number().int(),
        filter_length: z.number().int(),
        hop_length: z.number().int(),
        win_length: z.number().int(),
        n_mel_channels: z.number().int(),
        mel_fmin: z.number(),
        mel_fmax: z.number().nullable(),
        add_blank: z.boolean(),
        n_speakers: z.number().int(),
        cleaned_text: z.boolean(),
        spk2id: z.record(z.string(), z.number().int()),
        num_styles: z.number().int(),
        style2id: z.record(z.string(), z.number().int()),
    }),
    model: z.object({
        use_spk_conditioned_encoder: z.boolean(),
        use_noise_scaled_mas: z.boolean(),
        use_mel_posterior_encoder: z.boolean(),
        use_duration_discriminator: z.boolean(),
        use_wavlm_discriminator: z.boolean(),
        inter_channels: z.number().int(),
        hidden_channels: z.number().int(),
        filter_channels: z.number().int(),
        n_heads: z.number().int(),
        n_layers: z.number().int(),
        kernel_size: z.number().int(),
        p_dropout: z.number(),
        resblock: z.string(),
        resblock_kernel_sizes: z.array(z.number().int()),
        resblock_dilation_sizes: z.array(z.array(z.number().int())),
        upsample_rates: z.array(z.number().int()),
        upsample_kernel_sizes: z.array(z.number().int()),
        n_layers_q: z.number().int(),
        use_spectral_norm: z.boolean(),
        gin_channels: z.number().int(),
        slm: z.object({
            model: z.string(),
            sr: z.number().int(),
            hidden: z.number().int(),
            nlayers: z.number().int(),
            initial_channel: z.number().int(),
        }),
    }),
});
