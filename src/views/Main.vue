<template>
    <main>
        <Heading1 class="mt-6">1. ファイル選択</Heading1>
        <v-tabs class="mt-0" color="primary" bg-color="transparent" align-tabs="center" v-model="selectionTypeTabIndex">
            <v-tab style="text-transform: none !important;"
                v-for="selectionType in ['各ファイルから新規生成', '既存の .aivm ファイルを選択']" :key="selectionType">
                {{selectionType}}
            </v-tab>
        </v-tabs>
         <v-window v-model="selectionTypeTabIndex">
            <v-window-item class="pt-5 pb-6">
                <v-select variant="solo-filled" hide-details :items="['Style-Bert-VITS2 (JP-Extra)', 'Style-Bert-VITS2']"
                    label="音声合成アーキテクチャを選択" v-model="selectedArchitecture" />
                <v-file-input class="mt-4" variant="solo-filled" show-size hide-details
                    label="学習済みモデル (.safetensors) を選択" accept=".safetensors" v-model="selectedModel" />
                <div v-if="selectedArchitecture.startsWith('Style-Bert-VITS2')">
                    <v-file-input class="mt-4" variant="solo-filled" show-size hide-details
                        label="ハイパーパラメータ (config.json) を選択" accept=".json"
                        v-model="selectedConfig" />
                    <v-file-input class="mt-4" variant="solo-filled" show-size hide-details
                        label="スタイルベクトル (style_vectors.npy) を選択" accept=".npy" v-model="selectedStyleVectors" />
                </div>
            </v-window-item>
            <v-window-item class="pt-5 pb-5">
                <v-file-input variant="solo-filled" show-size hide-details
                    label="AIVM ファイル (.aivm) を選択" accept=".aivm" v-model="selectedAivm" />
            </v-window-item>
         </v-window>
        <Heading1 class="mt-0">2. メタデータ編集</Heading1>
        <v-row class="ma-0 mt-4">
            <v-col class="pa-0 pr-4" cols="12" md="7">
                <v-text-field variant="solo-filled" hide-details
                    label="音声合成モデルの名前" :disabled="!isAllFilesSelected" v-model="aivmManifest.name" />
                <v-textarea class="mt-4" variant="solo-filled" rows="3" hide-details
                    label="音声合成モデルの説明" :disabled="!isAllFilesSelected" v-model="aivmManifest.description" />
                <v-textarea class="mt-4" variant="solo-filled" rows="3" hide-details
                    label="音声合成モデルの利用規約 (Markdown 形式)" :disabled="!isAllFilesSelected" v-model="aivmManifest.terms_of_use" />
            </v-col>
            <v-col class="pa-0 pl-4" cols="12" md="5">
                <v-text-field variant="solo-filled" hide-details disabled
                    label="AIVM バージョン" v-model="aivmManifest.manifest_version" />
                <v-text-field variant="solo-filled" class="mt-4" hide-details disabled
                    label="音声合成モデルのアーキテクチャ" v-model="aivmManifest.model_architecture" />
                <v-text-field variant="solo-filled" class="mt-4" hide-details disabled
                    label="音声合成モデルの UUID" v-model="aivmManifest.uuid" />
                <v-text-field variant="solo-filled" class="mt-4"
                    :rules="[v => !!v || 'バージョンは必須です。', v => Utils.SEMVER_REGEX.test(v) || 'SemVer 2.0 形式のバージョンを入力してください。']"
                    label="音声合成モデルのバージョン" :disabled="!isAllFilesSelected" v-model="aivmManifest.version" />
            </v-col>
        </v-row>
    </main>
</template>
<script lang="ts" setup>

import { computed, ref } from 'vue';

import Heading1 from '@/components/Heading1.vue';
import { AivmManifest, DefaultAivmManifest } from '@/schemas/AivmManifest';
import Utils from '@/utils';

// 1. ファイル選択 での状態
const selectionTypeTabIndex = ref(0);
const selectedArchitecture = ref<'Style-Bert-VITS2 (JP-Extra)' | 'Style-Bert-VITS2'>('Style-Bert-VITS2 (JP-Extra)');
const selectedModel = ref<File | File[] | undefined>(undefined);
const selectedConfig = ref<File | File[] | undefined>(undefined);
const selectedStyleVectors = ref<File | File[] | undefined>(undefined);
const selectedAivm = ref<File | File[] | undefined>(undefined);

// 1. ファイル選択で全てのファイルが選択されているかどうか
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

// 2. メタデータ編集 での状態
// デフォルト値は DefaultAivmManifest で定義されている値
const aivmManifest = ref<AivmManifest>(structuredClone(DefaultAivmManifest));

</script>