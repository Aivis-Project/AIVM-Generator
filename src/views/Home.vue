<template>
    <main>
        <Heading2 class="mt-5">01. ファイル選択</Heading2>
        <v-tabs class="mt-0" color="primary" bg-color="transparent" align-tabs="center" v-model="selectionTypeTabIndex">
            <v-tab style="text-transform: none !important;"
                v-for="selectionType in ['各ファイルから新規生成', '既存の .aivm ファイルを選択']" :key="selectionType">
                {{selectionType}}
            </v-tab>
        </v-tabs>
         <v-window v-model="selectionTypeTabIndex">
            <v-window-item class="mt-5 pb-5">
                <v-select variant="solo-filled" hide-details :items="['Style-Bert-VITS2 JP-Extra', 'Style-Bert-VITS2']"
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
            <v-window-item class="mt-5 pb-5">
                <v-file-input variant="solo-filled" show-size hide-details
                    label="AIVM 音声合成モデルファイル (.aivm) を選択" accept=".aivm" v-model="selectedAivm" />
            </v-window-item>
         </v-window>
        <Heading2 class="mt-0">02. メタデータ編集</Heading2>
    </main>
</template>
<script lang="ts" setup>

import { ref } from 'vue';

import Heading2 from '@/components/Heading1.vue';

const selectionTypeTabIndex = ref(0);
const selectedArchitecture = ref<'Style-Bert-VITS2 JP-Extra' | 'Style-Bert-VITS2'>('Style-Bert-VITS2 JP-Extra');
const selectedModel = ref<File | File[] | undefined>(undefined);
const selectedConfig = ref<File | File[] | undefined>(undefined);
const selectedStyleVectors = ref<File | File[] | undefined>(undefined);
const selectedAivm = ref<File | File[] | undefined>(undefined);

</script>

