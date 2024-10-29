<template>
    <main>
        <Description class="mt-4" style="word-break: keep-all; overflow-wrap: anywhere;">
            <b>AIVM</b> (<b>Ai</b>vis <b>V</b>oice <b>M</b>odel) / <b>AIVMX</b> (<b>Ai</b>vis <b>V</b>oice <b>M</b>odel for ONN<b>X</b>) は、学習済みモデル・ハイパーパラメータ・スタイルベクトル・話者メタデータ<wbr>（名前・概要・ライセンス・アイコン・ボイスサンプル など）を 1 つのファイルにギュッとまとめた、AI 音声合成モデル用オープンファイルフォーマットです。<br>
            <a class="link" href="https://aivis-project.com/speech/" target="_blank">AivisSpeech</a> をはじめとした AIVM 仕様に対応するソフトウェアに AIVM / AIVMX ファイルを追加することで、AI 音声合成モデルを簡単に利用できます。<br>
        </Description>
        <Description class="mt-3">
            <strong>この AIVM Generator では、ブラウザ上の GUI で AIVM / AIVMX ファイルを生成・編集できます。</strong><br>
            すべての処理はブラウザ上で行われます。入力情報がサーバーにアップロードされることはありません。<br>
        </Description>
        <Description class="mt-3 px-5 py-3" style="border-left: 4px solid rgb(var(--v-theme-primary)); background-color: rgb(var(--v-theme-background-darken-1));
            word-break: keep-all; overflow-wrap: anywhere;">
            <a class="link" href="https://github.com/Aivis-Project/aivmlib" target="_blank">aivmlib</a> / <a class="link" href="https://github.com/Aivis-Project/aivmlib-web" target="_blank">aivmlib-web</a> では、AIVM / AIVMX ファイル内のメタデータを読み書きするための Python / JavaScript (Web) 向け<wbr>ユーティリティライブラリを提供しています。詳しくは <a class="link" href="https://github.com/Aivis-Project/aivmlib#aivm-specification" target="_blank">AIVM Specification</a> をご参照ください。<br>
        </Description>
        <Heading2 class="mt-7">1. ファイル選択</Heading2>
        <v-tabs class="mt-0" color="primary" bg-color="transparent" align-tabs="center"
            style="margin-top: -42px !important;" v-model="selectionTypeTabIndex">
            <v-tab style="text-transform: none !important;"
                v-for="selectionType in ['各ファイルから新規生成', '既存の .aivm ファイルを選択']" :key="selectionType">
                {{selectionType}}
            </v-tab>
        </v-tabs>
         <v-window v-model="selectionTypeTabIndex">
            <v-window-item class="pt-4 pb-5">
                <v-select variant="solo-filled" density="compact" hide-details :items="['Style-Bert-VITS2 (JP-Extra)', 'Style-Bert-VITS2']"
                    label="音声合成モデルのアーキテクチャを選択" v-model="selectedArchitecture" />
                <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                    label="学習済みモデル (.safetensors) を選択" accept=".safetensors" v-model="selectedModel" />
                <div v-if="selectedArchitecture.startsWith('Style-Bert-VITS2')">
                    <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                        label="ハイパーパラメータ (config.json) を選択" accept=".json"
                        v-model="selectedConfig" />
                    <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                        label="スタイルベクトル (style_vectors.npy) を選択" accept=".npy" v-model="selectedStyleVectors" />
                </div>
            </v-window-item>
            <v-window-item class="pt-4 pb-5">
                <v-file-input variant="solo-filled" density="compact" show-size hide-details
                    label="AIVM ファイル (.aivm) を選択" accept=".aivm" v-model="selectedAivm" />
            </v-window-item>
         </v-window>
        <Heading2 class="mt-1">2. メタデータ編集</Heading2>
        <v-form ref="form" @submit.prevent>
            <div class="mt-4 d-flex" style="gap: 20px;">
                <div class="w-100">
                    <v-text-field variant="solo-filled" density="compact" hide-details
                        label="音声合成モデルの名前 (話者が1人の場合は話者名と自動同期されます)" :disabled="!isAllFilesSelected" v-model="aivmManifest.name"
                        :rules="[v => !!v || '音声合成モデルの名前は必須です。']" />
                    <v-textarea variant="solo-filled" class="mt-3" density="compact" rows="4" hide-details
                        label="音声合成モデルの説明 (省略可)" :disabled="!isAllFilesSelected" v-model="aivmManifest.description" />
                    <v-combobox variant="solo-filled" class="mt-3" density="default" hide-details
                        label="音声合成モデルの作成者 (複数追加・省略可)" :disabled="!isAllFilesSelected" v-model="aivmManifest.creators"
                        multiple chips closable-chips>
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-list-item-title>
                                    作成者名を入力し、Enter キーを押して追加してください。
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-combobox>
                    <v-textarea variant="solo-filled" class="mt-3" density="compact" rows="2" hide-details
                        label="音声合成モデルの利用規約 (Markdown 形式 / 省略可)" :disabled="!isAllFilesSelected" v-model="aivmManifest.license" />
                </div>
                <div style="width: 360px; flex-shrink: 0;">
                    <v-text-field variant="solo-filled" density="compact" hide-details readonly
                        label="AIVM マニフェストバージョン (読み取り専用)" :disabled="!isAllFilesSelected" v-model="aivmManifest.manifest_version" />
                    <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details readonly
                        label="音声合成モデルのアーキテクチャ (読み取り専用)" :disabled="!isAllFilesSelected" v-model="aivmManifest.model_architecture" />
                    <v-number-input variant="solo-filled" class="mt-3" density="compact" hide-details :min="1"
                        label="音声合成モデルのエポック数" :disabled="!isAllFilesSelected" v-model="aivmManifest.training_epochs" />
                    <v-number-input variant="solo-filled" class="mt-3" density="compact" hide-details :min="1"
                        label="音声合成モデルのステップ数" :disabled="!isAllFilesSelected" v-model="aivmManifest.training_steps" />
                    <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details readonly
                        label="音声合成モデルの UUID (読み取り専用)" :disabled="!isAllFilesSelected" v-model="aivmManifest.uuid" />
                    <v-text-field variant="solo-filled" class="mt-3" density="compact"
                        :rules="[v => !!v || 'バージョンは必須です。', v => Utils.SEMVER_REGEX.test(v) || 'SemVer 2.0 形式のバージョンを入力してください。']"
                        label="音声合成モデルのバージョン" :disabled="!isAllFilesSelected" v-model="aivmManifest.version" />
                </div>
            </div>
            <v-tabs class="mt-0" color="primary" bg-color="transparent" align-tabs="center"
                :disabled="!isAllFilesSelected" v-model="speakerTabIndex">
                <v-tab style="text-transform: none !important;" v-for="speaker in aivmManifest.speakers" :key="speaker.uuid">
                    話者{{ `${speaker.local_id + 1} (${speaker.name})` }}
                </v-tab>
            </v-tabs>
            <v-window v-model="speakerTabIndex">
                <v-window-item class="aivm-speaker mt-3" v-for="speaker in aivmManifest.speakers" :key="speaker.uuid">
                    <div class="mt-2 mb-4 d-flex" style="gap: 20px;">
                        <div class="aivm-speaker-style__icon ml-5" :class="{ 'aivm-speaker-style__icon--disabled': !isAllFilesSelected }" style="position: relative;">
                            <img :src="speaker.icon"
                                v-ftooltip="'クリックまたはドラッグ&ドロップでこの話者全体のアイコンを変更できます。'"
                                @click="Utils.selectFile('image/*').then((file) => handleIconClick(file, speaker.icon, true)
                                    .then((dataUrl) => speaker.icon = dataUrl!))"
                                @dragover.prevent="event => {
                                    if (event.target) (event.target as HTMLElement).style.border = '4px dashed rgb(var(--v-theme-secondary))'
                                }"
                                @dragleave="event => {
                                    if (event.target) (event.target as HTMLElement).style.border = '';
                                }"
                                @drop.prevent="(event) => {
                                    if (event.target) (event.target as HTMLElement).style.border = '';
                                    const file = event.dataTransfer?.files[0];
                                    if (file) handleIconClick(file, speaker.icon, true).then((dataUrl) => speaker.icon = dataUrl!);
                                }" />
                            <Icon class="aivm-speaker-style__icon-edit" icon="fluent:edit-16-filled" height="30px" />
                        </div>
                        <div class="w-100">
                            <v-text-field variant="solo-filled" density="compact" hide-details
                                label="話者の名前 (話者が1人の場合は音声合成モデル名と自動同期されます)" :disabled="!isAllFilesSelected" v-model="speaker.name"
                                :rules="[v => !!v || '話者の名前は必須です。']" />
                            <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details readonly
                                label="話者の対応言語 (読み取り専用)" :disabled="!isAllFilesSelected" v-model="speaker.supported_languages" />
                        </div>
                        <div style="width: 360px; flex-shrink: 0;">
                            <v-text-field variant="solo-filled" density="compact" hide-details readonly
                                label="話者の UUID (読み取り専用)" :disabled="!isAllFilesSelected" v-model="speaker.uuid" />
                            <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details readonly
                                label="話者のローカル ID (読み取り専用)" :disabled="!isAllFilesSelected" v-model="speaker.local_id" />
                        </div>
                    </div>
                    <div>
                        <div class="aivm-speaker-style" v-for="(style, index) in speaker.styles" :key="style.local_id"
                            :class="{ 'aivm-speaker-style--disabled': !isAllFilesSelected }">
                            <div class="aivm-speaker-style__icon" style="position: relative;">
                                <img :src="style.icon ?? speaker.icon"
                                    v-ftooltip="'クリックまたはドラッグ&ドロップでスタイルごとにアイコンを変更できます。未指定時は話者全体のアイコンが使われます。'"
                                    @click="Utils.selectFile('image/*').then((file) => handleIconClick(file, style.icon)
                                        .then((dataUrl) => style.icon = dataUrl))"
                                    @dragover.prevent="event => {
                                        if (event.target) (event.target as HTMLElement).style.border = '4px dashed rgb(var(--v-theme-secondary))'
                                    }"
                                    @dragleave="event => {
                                        if (event.target) (event.target as HTMLElement).style.border = '';
                                    }"
                                    @drop.prevent="(event) => {
                                        if (event.target) (event.target as HTMLElement).style.border = '';
                                        const file = event.dataTransfer?.files[0];
                                        if (file) handleIconClick(file, style.icon).then((dataUrl) => style.icon = dataUrl);
                                    }" />
                                <Icon class="aivm-speaker-style__icon-edit" icon="fluent:edit-16-filled" height="30px" />
                            </div>
                            <div class="d-flex align-center" style="height: 120px;">
                                <div class="w-100">
                                    <v-text-field variant="solo-filled" class="w-100" density="compact" hide-details
                                        label="スタイルの名前" :disabled="!isAllFilesSelected" v-model="style.name"
                                        :rules="[v => !!v || 'スタイルの名前は必須です。']" />
                                    <v-text-field variant="solo-filled" class="w-100 mt-3" density="compact" hide-details readonly
                                        label="スタイルのローカル ID (読み取り専用)" :disabled="!isAllFilesSelected" v-model="style.local_id" />
                                </div>
                            </div>
                            <div>
                                <div class="d-flex align-center">
                                    <Heading3>
                                        <div>
                                            ボイスサンプル
                                            <Description style="margin-top: 2px; font-size: 11px; line-height: 1.5;">
                                                3つほどボイスサンプルを追加しておくことを推奨します。
                                                <span v-if="index === 0">このノーマルスタイルのボイスサンプルはこの話者全体のボイスサンプルとしても使われます。</span>
                                            </Description>
                                        </div>
                                        <template #action-button>
                                            <ActionButton secondary icon="fluent:add-16-filled" font_size="13.5px"
                                                @click="style.voice_samples.length < 10 && style.voice_samples.push({
                                                    audio: DEFAULT_VOICE_SAMPLE_DATA_URL,
                                                    transcript: '',
                                                })">
                                                追加
                                            </ActionButton>
                                        </template>
                                    </Heading3>
                                </div>
                                <div class="mt-3 aivm-voice-sample" v-for="voiceSample in style.voice_samples" :key="voiceSample.audio">
                                    <div class="d-flex flex-column w-100" style="gap: 8px;">
                                        <div class="d-flex align-center">
                                            <audio class="w-100" style="height: 36px;" controls :src="voiceSample.audio"></audio>
                                            <ActionButton icon="fluent:headphones-sound-wave-20-filled" class="ml-3" font_size="13.5px"
                                                @click="Utils.selectFile('audio/*').then(async (file) => {
                                                    if (file) voiceSample.audio = await Utils.fileToDataURL(file);
                                                })">
                                                ファイル選択
                                            </ActionButton>
                                        </div>
                                        <v-text-field variant="solo-filled" density="compact" hide-details
                                            label="ボイスサンプルの書き起こし文 (必須)" v-model="voiceSample.transcript"
                                            :rules="[v => !!v || '書き起こし文は必須です。']" />
                                    </div>
                                    <ActionButton icon="fluent:delete-16-filled" class="ml-3" font_size="13.5px"
                                        @click="style.voice_samples.splice(style.voice_samples.indexOf(voiceSample), 1)">
                                        削除
                                    </ActionButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-window-item>
            </v-window>
            <v-textarea variant="solo-filled" class="mt-5" density="compact" rows="8" hide-details readonly
                label="ハイパーパラメータ (読み取り専用)" :disabled="!isAllFilesSelected"
                :model-value="JSON.stringify(aivmMetadata?.hyper_parameters, null, 4)" />
        </v-form>
        <Heading2 class="mt-6">3. AIVM ファイルを生成</Heading2>
        <div class="mt-4 d-flex justify-center">
            <ActionButton secondary icon="fluent:save-20-filled" height="45px" font_size="14px"
                :disabled="!isAllFilesSelected" @click="downloadAivmFile">
                上記メタデータで AIVM ファイル (.aivm) を生成
            </ActionButton>
        </div>
    </main>
</template>
<script lang="ts" setup>


import { computed, ref, watch } from 'vue';
import { VForm } from 'vuetify/components';
import { VNumberInput } from 'vuetify/labs/components';

import ActionButton from '@/components/ActionButton.vue';
import Description from '@/components/Description.vue';
import Heading2 from '@/components/Heading2.vue';
import Heading3 from '@/components/Heading3.vue';
import Message from '@/message';
import { AivmMetadata, DefaultAivmManifest } from '@/schemas/AivmManifest';
import { DEFAULT_ICON_DATA_URL, DEFAULT_VOICE_SAMPLE_DATA_URL } from '@/schemas/AivmManifestConstants';
import Utils from '@/utils';
import Aivmlib from '@/utils/Aivmlib';

// 1. ファイル選択 での状態
const selectionTypeTabIndex = ref(0);
const selectedArchitecture = ref<'Style-Bert-VITS2 (JP-Extra)' | 'Style-Bert-VITS2'>('Style-Bert-VITS2 (JP-Extra)');
const selectedModel = ref<File | File[] | undefined>(undefined);
const selectedConfig = ref<File | File[] | undefined>(undefined);
const selectedStyleVectors = ref<File | File[] | undefined>(undefined);
const selectedAivm = ref<File | File[] | undefined>(undefined);

// 1. ファイル選択 で全てのファイルが選択されているかどうか
const isAllFilesSelected = computed(() => {
    // 「各ファイルから新規生成」の場合
    if (selectionTypeTabIndex.value === 0) {
        // Style-Bert-VITS2 系モデルは追加で config.json と style_vectors.npy が必要
        if (selectedArchitecture.value.startsWith('Style-Bert-VITS2')) {
            return selectedModel.value !== undefined && selectedConfig.value !== undefined && selectedStyleVectors.value !== undefined;
        } else {
            return selectedModel.value !== undefined;
        }
    // 「既存の .aivm ファイルを選択」の場合
    } else {
        return selectedAivm.value !== undefined;
    }
});

// 1. ファイル選択 のいずれかの値が変更されたら、メタデータ編集の入力欄をリセット
// その際全てのファイルが選択されていれば、 AIVM メタデータの生成 or 再読み込みを実行する
watch([selectedArchitecture, selectedModel, selectedConfig, selectedStyleVectors, selectedAivm], () => {
    aivmMetadata.value = null;
    speakerTabIndex.value = 0;

    // 全てのファイルが選択されている場合
    if (isAllFilesSelected.value) {
        if (selectionTypeTabIndex.value === 0) {
            // 「各ファイルから新規生成」の場合
            Aivmlib.generateAivmMetadata(
                selectedArchitecture.value,
                selectedConfig.value as File,
                selectedStyleVectors.value as File | null,
            ).then((metadata) => {
                // モデルファイル名からエポック数とステップ数を抽出
                const modelFileName = (selectedModel.value as File).name;
                const epochMatch = modelFileName.match(/e(\d{2,})/);  // "e" の後ろに2桁以上の数字
                const stepMatch = modelFileName.match(/s(\d{2,})/);  // "s" の後ろに2桁以上の数字
                // エポック数を設定
                if (epochMatch) {
                    metadata.manifest.training_epochs = parseInt(epochMatch[1], 10);
                }
                // ステップ数を設定
                if (stepMatch) {
                    metadata.manifest.training_steps = parseInt(stepMatch[1], 10);
                }
                aivmMetadata.value = metadata;
            }).catch((error) => {
                Message.error(error.message);
                console.error(error);
            });
        } else {
            // 「既存の .aivm ファイルを選択」の場合
            Aivmlib.readAivmMetadata(
                selectedAivm.value as File,
            ).then((metadata) => {
                aivmMetadata.value = metadata;
            }).catch((error) => {
                Message.error(error.message);
                console.error(error);
            });
        }
    }
});

// 2. メタデータ編集 でのフォーム
const form = ref<VForm | null>(null);

// 2. メタデータ編集 での AIVM メタデータの状態
const aivmMetadata = ref<AivmMetadata | null>(null);
const aivmManifest = computed(() => {
    // AIVM メタデータが読み込まれていない場合はデフォルト値を返す
    return aivmMetadata.value?.manifest ?? structuredClone(DefaultAivmManifest);
});

// 2. メタデータ編集 で選択されている話者のタブインデックス
const speakerTabIndex = ref(0);

// 話者が1人の場合は話者名と音声合成モデル名を相互に同期
watch(() => aivmManifest.value.name, (name) => {
    if (aivmManifest.value.speakers.length === 1) {
        aivmManifest.value.speakers[0].name = name;
    }
});
watch(() => aivmManifest.value.speakers[0].name, (name) => {
    if (aivmManifest.value.speakers.length === 1) {
        aivmManifest.value.name = name;
    }
});

// 2. メタデータ編集でアイコンがクリックされた時のバリデーション処理
async function handleIconClick(file: File | null, currentIcon: string | null, for_speaker: boolean = false): Promise<string | null> {
    if (file) {
        // 渡された File の MIME タイプが画像であることを確認
        if (!file.type.startsWith('image/')) {
            Message.error('指定するアイコンは画像ファイルである必要があります。');
            return currentIcon;
        }
        // SVG ファイルには未対応
        if (file.type === 'image/svg+xml') {
            Message.error('SVG ファイルには対応していません。');
            return currentIcon;
        }
        // 正方形にクロップ
        const croppedFile = await Utils.cropImageToSquare(file);
        // Data URL に変換
        const dataUrl = await Utils.fileToDataURL(croppedFile);
        // 選択されたアイコンにする
        return dataUrl;
    // キャンセルされた場合
    } else {
        // 話者のアイコンの場合はデフォルトのアイコンを返す
        if (for_speaker) {
            return DEFAULT_ICON_DATA_URL;
        // スタイルのアイコンの場合は話者のアイコンを使うよう、null を返す
        } else {
            return null;
        }
    }
}

// 3. AIVM ファイルを生成 での処理
async function downloadAivmFile() {
    if (aivmMetadata.value === null) {
        Message.error('AIVM メタデータが読み込まれていません。');
        return;
    }

    // バリデーションを実行
    if ((await form.value!.validate()).valid === false) {
        Message.error('入力内容にエラーがあります。');
        return;
    }

    // 「各ファイルから新規生成」の場合は Safetensors ファイルを、
    // 「既存の .aivm ファイルを選択」の場合は AIVM ファイルを書き込み元として使用
    const safetensorsFile = selectionTypeTabIndex.value === 0
        ? selectedModel.value as File
        : selectedAivm.value as File;

    // Safetensors or AIVM ファイルに AIVM メタデータを埋め込んでダウンロード
    Aivmlib.writeAivmMetadata(
        safetensorsFile,
        aivmMetadata.value,
    ).then((blob) => {
        // モデル名をファイル名としてダウンロード
        Utils.downloadBlobData(blob, `${aivmManifest.value.name}.aivm`);
    }).catch((error) => {
        Message.error(error.message);
        console.error(error);
    });
}

</script>
<style lang="scss" scoped>

.aivm-speaker {
    padding: 12px 16px;
    border: 1px solid rgb(var(--v-theme-background-lighten-2));
    border-radius: 12px;
}

.aivm-speaker-style {
    display: grid;
    grid-template-columns: 120px 210px 1fr;
    gap: 20px;
    margin-top: 12px;
    padding: 12px 20px;
    border: 1px solid rgb(var(--v-theme-background-lighten-2));
    border-radius: 12px;
    background: rgb(var(--v-theme-background-lighten-1));
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
    &:first-of-type {
        margin-top: 0;
    }
    &--disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    &__icon {
        display: block;
        flex-shrink: 0;
        width: 120px;
        height: 120px;
        background: rgb(var(--v-theme-background-darken-1));
        aspect-ratio: 1 / 1;
        object-fit: contain;
        cursor: pointer;
        transition: filter 0.2s;
        &:hover {
            filter: brightness(0.8);
        }

        &--disabled {
            opacity: 0.5;
            pointer-events: none;
        }

        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 32px;
        }

        &-edit {
            position: absolute;
            top: 0;
            right: 0;
            padding-top: 10px;
            padding-right: 10px;
            padding-left: 6px;
            padding-bottom: 6px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 0 0 0 12px;
            cursor: pointer;
            pointer-events: none;
        }

        // iOS アプリアイコンライクな Squircle な角丸
        // ref: https://b.0218.jp/202112010005.html
        clip-path: polygon(100% 50%, 100% 56.6%, 100% 59.3%, 100% 61.4%, 99.9% 63.2%, 99.9% 64.8%, 99.9% 66.2%, 99.8% 67.5%, 99.8% 68.7%, 99.7% 69.8%, 99.6% 70.8%, 99.5% 71.8%, 99.5% 72.8%, 99.4% 73.7%, 99.3% 74.6%, 99.1% 75.4%, 99% 76.3%, 98.9% 77%, 98.8% 77.8%, 98.6% 78.5%, 98.5% 79.2%, 98.3% 79.9%, 98.1% 80.6%, 98% 81.3%, 97.8% 81.9%, 97.6% 82.5%, 97.4% 83.1%, 97.2% 83.7%, 97% 84.3%, 96.8% 84.8%, 96.5% 85.4%, 96.3% 85.9%, 96% 86.4%, 95.8% 86.9%, 95.5% 87.4%, 95.3% 87.9%, 95% 88.3%, 94.7% 88.8%, 94.4% 89.2%, 94.1% 89.7%, 93.8% 90.1%, 93.4% 90.5%, 93.1% 90.9%, 92.8% 91.3%, 92.4% 91.7%, 92% 92%, 91.7% 92.4%, 91.3% 92.8%, 90.9% 93.1%, 90.5% 93.4%, 90.1% 93.8%, 89.7% 94.1%, 89.2% 94.4%, 88.8% 94.7%, 88.3% 95%, 87.9% 95.3%, 87.4% 95.5%, 86.9% 95.8%, 86.4% 96%, 85.9% 96.3%, 85.4% 96.5%, 84.8% 96.8%, 84.3% 97%, 83.7% 97.2%, 83.1% 97.4%, 82.5% 97.6%, 81.9% 97.8%, 81.3% 98%, 80.6% 98.1%, 79.9% 98.3%, 79.2% 98.5%, 78.5% 98.6%, 77.8% 98.8%, 77% 98.9%, 76.3% 99%, 75.4% 99.1%, 74.6% 99.3%, 73.7% 99.4%, 72.8% 99.5%, 71.8% 99.5%, 70.8% 99.6%, 69.8% 99.7%, 68.7% 99.8%, 67.5% 99.8%, 66.2% 99.9%, 64.8% 99.9%, 63.2% 99.9%, 61.4% 100%, 59.3% 100%, 56.6% 100%, 50% 100%, 43.4% 100%, 40.7% 100%, 38.6% 100%, 36.8% 99.9%, 35.2% 99.9%, 33.8% 99.9%, 32.5% 99.8%, 31.3% 99.8%, 30.2% 99.7%, 29.2% 99.6%, 28.2% 99.5%, 27.2% 99.5%, 26.3% 99.4%, 25.4% 99.3%, 24.6% 99.1%, 23.7% 99%, 23% 98.9%, 22.2% 98.8%, 21.5% 98.6%, 20.8% 98.5%, 20.1% 98.3%, 19.4% 98.1%, 18.7% 98%, 18.1% 97.8%, 17.5% 97.6%, 16.9% 97.4%, 16.3% 97.2%, 15.7% 97%, 15.2% 96.8%, 14.6% 96.5%, 14.1% 96.3%, 13.6% 96%, 13.1% 95.8%, 12.6% 95.5%, 12.1% 95.3%, 11.7% 95%, 11.2% 94.7%, 10.8% 94.4%, 10.3% 94.1%, 9.9% 93.8%, 9.5% 93.4%, 9.1% 93.1%, 8.7% 92.8%, 8.3% 92.4%, 8% 92%, 7.6% 91.7%, 7.2% 91.3%, 6.9% 90.9%, 6.6% 90.5%, 6.2% 90.1%, 5.9% 89.7%, 5.6% 89.2%, 5.3% 88.8%, 5% 88.3%, 4.7% 87.9%, 4.5% 87.4%, 4.2% 86.9%, 4% 86.4%, 3.7% 85.9%, 3.5% 85.4%, 3.2% 84.8%, 3% 84.3%, 2.8% 83.7%, 2.6% 83.1%, 2.4% 82.5%, 2.2% 81.9%, 2% 81.3%, 1.9% 80.6%, 1.7% 79.9%, 1.5% 79.2%, 1.4% 78.5%, 1.2% 77.8%, 1.1% 77%, 1% 76.3%, 0.9% 75.4%, 0.7% 74.6%, 0.6% 73.7%, 0.5% 72.8%, 0.5% 71.8%, 0.4% 70.8%, 0.3% 69.8%, 0.2% 68.7%, 0.2% 67.5%, 0.1% 66.2%, 0.1% 64.8%, 0.1% 63.2%, 0% 61.4%, 0% 59.3%, 0% 56.6%, 0% 50%, 0% 43.4%, 0% 40.7%, 0% 38.6%, 0.1% 36.8%, 0.1% 35.2%, 0.1% 33.8%, 0.2% 32.5%, 0.2% 31.3%, 0.3% 30.2%, 0.4% 29.2%, 0.5% 28.2%, 0.5% 27.2%, 0.6% 26.3%, 0.7% 25.4%, 0.9% 24.6%, 1% 23.7%, 1.1% 23%, 1.2% 22.2%, 1.4% 21.5%, 1.5% 20.8%, 1.7% 20.1%, 1.9% 19.4%, 2% 18.7%, 2.2% 18.1%, 2.4% 17.5%, 2.6% 16.9%, 2.8% 16.3%, 3% 15.7%, 3.2% 15.2%, 3.5% 14.6%, 3.7% 14.1%, 4% 13.6%, 4.2% 13.1%, 4.5% 12.6%, 4.7% 12.1%, 5% 11.7%, 5.3% 11.2%, 5.6% 10.8%, 5.9% 10.3%, 6.2% 9.9%, 6.6% 9.5%, 6.9% 9.1%, 7.2% 8.7%, 7.6% 8.3%, 8% 8%, 8.3% 7.6%, 8.7% 7.2%, 9.1% 6.9%, 9.5% 6.6%, 9.9% 6.2%, 10.3% 5.9%, 10.8% 5.6%, 11.2% 5.3%, 11.7% 5%, 12.1% 4.7%, 12.6% 4.5%, 13.1% 4.2%, 13.6% 4%, 14.1% 3.7%, 14.6% 3.5%, 15.2% 3.2%, 15.7% 3%, 16.3% 2.8%, 16.9% 2.6%, 17.5% 2.4%, 18.1% 2.2%, 18.7% 2%, 19.4% 1.9%, 20.1% 1.7%, 20.8% 1.5%, 21.5% 1.4%, 22.2% 1.2%, 23% 1.1%, 23.7% 1%, 24.6% 0.9%, 25.4% 0.7%, 26.3% 0.6%, 27.2% 0.5%, 28.2% 0.5%, 29.2% 0.4%, 30.2% 0.3%, 31.3% 0.2%, 32.5% 0.2%, 33.8% 0.1%, 35.2% 0.1%, 36.8% 0.1%, 38.6% 0%, 40.7% 0%, 43.4% 0%, 50% 0%, 56.6% 0%, 59.3% 0%, 61.4% 0%, 63.2% 0.1%, 64.8% 0.1%, 66.2% 0.1%, 67.5% 0.2%, 68.7% 0.2%, 69.8% 0.3%, 70.8% 0.4%, 71.8% 0.5%, 72.8% 0.5%, 73.7% 0.6%, 74.6% 0.7%, 75.4% 0.9%, 76.3% 1%, 77% 1.1%, 77.8% 1.2%, 78.5% 1.4%, 79.2% 1.5%, 79.9% 1.7%, 80.6% 1.9%, 81.3% 2%, 81.9% 2.2%, 82.5% 2.4%, 83.1% 2.6%, 83.7% 2.8%, 84.3% 3%, 84.8% 3.2%, 85.4% 3.5%, 85.9% 3.7%, 86.4% 4%, 86.9% 4.2%, 87.4% 4.5%, 87.9% 4.7%, 88.3% 5%, 88.8% 5.3%, 89.2% 5.6%, 89.7% 5.9%, 90.1% 6.2%, 90.5% 6.6%, 90.9% 6.9%, 91.3% 7.2%, 91.7% 7.6%, 92% 8%, 92.4% 8.3%, 92.8% 8.7%, 93.1% 9.1%, 93.4% 9.5%, 93.8% 9.9%, 94.1% 10.3%, 94.4% 10.8%, 94.7% 11.2%, 95% 11.7%, 95.3% 12.1%, 95.5% 12.6%, 95.8% 13.1%, 96% 13.6%, 96.3% 14.1%, 96.5% 14.6%, 96.8% 15.2%, 97% 15.7%, 97.2% 16.3%, 97.4% 16.9%, 97.6% 17.5%, 97.8% 18.1%, 98% 18.7%, 98.1% 19.4%, 98.3% 20.1%, 98.5% 20.8%, 98.6% 21.5%, 98.8% 22.2%, 98.9% 23%, 99% 23.7%, 99.1% 24.6%, 99.3% 25.4%, 99.4% 26.3%, 99.5% 27.2%, 99.5% 28.2%, 99.6% 29.2%, 99.7% 30.2%, 99.8% 31.3%, 99.8% 32.5%, 99.9% 33.8%, 99.9% 35.2%, 99.9% 36.8%, 100% 38.6%, 100% 40.7%, 100% 43.4%);
    }
}

.aivm-voice-sample {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid rgb(var(--v-theme-background-lighten-2));
    border-radius: 12px;
    background: rgb(var(--v-theme-background-lighten-2));
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
}

</style>