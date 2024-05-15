<template>
    <main>
        <Description class="mt-4">
            <a class="link" href="https://github.com/Aivis-Project/AIVM-Specification" target="_blank">AIVM (Aivis Voice Model)</a> は、学習済みモデル・ハイパーパラメータ・スタイルベクトル・話者メタデータ（名前 / 概要 / アイコン / ボイスサンプル など）を 1 つのファイルにギュッとまとめた、AI 音声合成モデル用オープンファイルフォーマットです。<br>
            <a class="link" href="https://speech.aivis-project.com" target="_blank">AivisSpeech</a> をはじめとした対応ソフトウェアに AIVM ファイルを追加することで、AI 音声合成モデルを簡単に利用できます。
        </Description>
        <Heading2 class="mt-5">1. ファイル選択</Heading2>
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
        <Heading2 class="mt-0">2. メタデータ編集</Heading2>
        <v-row class="ma-0 mt-4">
            <v-col class="pa-0 pr-4" cols="12" md="7">
                <v-text-field variant="solo-filled" density="compact" hide-details
                    label="音声合成モデルの名前" :disabled="!isAllFilesSelected" v-model="aivmManifest.name" />
                <v-textarea variant="solo-filled" class="mt-3" density="compact" rows="3" hide-details
                    label="音声合成モデルの説明 (省略可)" :disabled="!isAllFilesSelected" v-model="aivmManifest.description" />
                <v-textarea variant="solo-filled" class="mt-3" density="compact" rows="3" hide-details
                    label="音声合成モデルの利用規約 (Markdown 形式 / 省略可)" :disabled="!isAllFilesSelected" v-model="aivmManifest.terms_of_use" />
            </v-col>
            <v-col class="pa-0 pl-4" cols="12" md="5">
                <v-text-field variant="solo-filled" density="compact" hide-details readonly
                    label="AIVM マニフェストバージョン (読み取り専用)" :disabled="!isAllFilesSelected" v-model="aivmManifest.manifest_version" />
                <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details readonly
                    label="音声合成モデルのアーキテクチャ (読み取り専用)" :disabled="!isAllFilesSelected" v-model="aivmManifest.model_architecture" />
                <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details readonly
                    label="音声合成モデルの UUID (読み取り専用)" :disabled="!isAllFilesSelected" v-model="aivmManifest.uuid" />
                <v-text-field variant="solo-filled" class="mt-3" density="compact"
                    :rules="[v => !!v || 'バージョンは必須です。', v => Utils.SEMVER_REGEX.test(v) || 'SemVer 2.0 形式のバージョンを入力してください。']"
                    label="音声合成モデルのバージョン" :disabled="!isAllFilesSelected" v-model="aivmManifest.version" />
            </v-col>
        </v-row>
        <v-tabs class="mt-0" color="primary" bg-color="transparent" align-tabs="center"
            :disabled="!isAllFilesSelected" v-model="speakerTabIndex">
            <v-tab style="text-transform: none !important;" v-for="speaker in aivmManifest.speakers" :key="speaker.uuid">
                話者{{ `${speaker.local_id + 1} (${speaker.name})` }}
            </v-tab>
        </v-tabs>
         <v-window v-model="speakerTabIndex">
            <v-window-item class="pt-4" v-for="speaker in aivmManifest.speakers" :key="speaker.uuid">
                <v-row class="ma-0">
                    <v-col class="pa-0 pr-4" cols="12" md="7">
                        <v-text-field variant="solo-filled" density="compact" hide-details
                            label="話者の名前" :disabled="!isAllFilesSelected" v-model="speaker.name" />
                        <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details readonly
                            label="話者の対応言語 (読み取り専用)" :disabled="!isAllFilesSelected" v-model="speaker.supported_languages" />
                    </v-col>
                    <v-col class="pa-0 pl-4" cols="12" md="5">
                        <v-text-field variant="solo-filled" density="compact" hide-details readonly
                            label="話者の UUID (読み取り専用)" :disabled="!isAllFilesSelected" v-model="speaker.uuid" />
                        <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details readonly
                            label="話者のローカル ID (読み取り専用)" :disabled="!isAllFilesSelected" v-model="speaker.local_id" />
                        <v-text-field variant="solo-filled" class="mt-3" density="compact"
                            :rules="[v => !!v || 'バージョンは必須です。', v => Utils.SEMVER_REGEX.test(v) || 'SemVer 2.0 形式のバージョンを入力してください。']"
                            label="話者のバージョン" :disabled="!isAllFilesSelected" v-model="speaker.version" />
                    </v-col>
                </v-row>
                <div>
                    <div class="aivm-speaker-style" v-for="style in speaker.styles" :key="style.local_id">
                        <div class="d-flex flex-column">
                            <v-text-field variant="solo-filled" density="compact" hide-details
                                label="スタイルの名前" :disabled="!isAllFilesSelected" v-model="style.name" />
                            <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details
                                label="話者のローカル ID (読み取り専用)" :disabled="!isAllFilesSelected" v-model="style.local_id" />
                        </div>
                    </div>
                </div>
            </v-window-item>
         </v-window>
        <v-textarea variant="solo-filled" class="mt-4" density="compact" rows="8" hide-details readonly
            label="ハイパーパラメータ (読み取り専用)" :disabled="!isAllFilesSelected"
            :model-value="JSON.stringify(aivmMetadata?.hyper_parameters, null, 4)" />
        <Heading2 class="mt-5">3. AIVM ファイルを生成</Heading2>
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

import ActionButton from '@/components/ActionButton.vue';
import Description from '@/components/Description.vue';
import Heading2 from '@/components/Heading2.vue';
import Message from '@/message';
import { AivmMetadata, DefaultAivmManifest } from '@/schemas/AivmManifest';
import Utils from '@/utils';
import AivmUtils from '@/utils/AivmUtils';

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
            AivmUtils.generateAivmMetadata(
                selectedArchitecture.value,
                selectedConfig.value as File,
                selectedStyleVectors.value as File | null,
            ).then((metadata) => {
                aivmMetadata.value = metadata;
            }).catch((error) => {
                Message.error(error.message);
                console.error(error);
            });
        } else {
            // 「既存の .aivm ファイルを選択」の場合
            AivmUtils.readAivmMetadata(
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

// 2. メタデータ編集 での AIVM メタデータの状態
const aivmMetadata = ref<AivmMetadata | null>(null);
const aivmManifest = computed(() => {
    // AIVM メタデータが読み込まれていない場合はデフォルト値を返す
    return aivmMetadata.value?.manifest ?? structuredClone(DefaultAivmManifest);
});

// 2. メタデータ編集 で選択されている話者のタブインデックス
const speakerTabIndex = ref(0);

// 3. AIVM ファイルを生成 での処理
function downloadAivmFile() {
    if (aivmMetadata.value === null) {
        Message.error('AIVM メタデータが読み込まれていません。');
        return;
    }

    // 「各ファイルから新規生成」の場合は Safetensors ファイルを、
    // 「既存の .aivm ファイルを選択」の場合は AIVM ファイルを書き込み元として使用
    const safetensorsFile = selectionTypeTabIndex.value === 0
        ? selectedModel.value as File
        : selectedAivm.value as File;

    // Safetensors or AIVM ファイルに AIVM メタデータを埋め込んでダウンロード
    AivmUtils.writeAivmMetadata(
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

.aivm-speaker-style {
    background: rgb(var(--v-theme-background-lighten-1));
    margin-top: 12px;
    padding: 12px 20px;
    border: 1px solid rgb(var(--v-theme-background-lighten-2));
    border-radius: 12px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
    &:first-of-type {
        margin-top: 0;
    }
}

</style>