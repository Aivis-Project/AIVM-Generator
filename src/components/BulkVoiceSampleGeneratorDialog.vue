<template>
    <v-dialog :model-value="modelValue" persistent max-width="790px" @update:modelValue="!$event && cancelGeneration()">
        <v-card>
            <v-card-title class="px-6 pt-5 pb-0 font-weight-bold">ボイスサンプルを一括生成</v-card-title>
            <v-card-text class="px-6">
                <p>指定されたテキストを使い、すべての話者・スタイルのボイスサンプルを AivisSpeech Engine API で一括生成します。</p>
                <p class="mt-1" style="font-size: 13px;">あらかじめ、この PC で AivisSpeech Engine ({{ aivisSpeechApiBaseUrl }}) を起動しておく必要があります。</p>
                <v-textarea
                    v-model="bulkGenerationTextsInput"
                    class="mt-4"
                    label="生成するテキスト (1行に1つのボイスサンプルが生成されます)"
                    rows="8"
                    variant="solo-filled"
                    density="compact"
                    hide-details
                    :readonly="isGeneratingBulkVoiceSamples"
                ></v-textarea>
                <v-text-field
                    v-model="aivisSpeechApiBaseUrl"
                    class="mt-3"
                    label="AivisSpeech Engine API の Base URL"
                    variant="solo-filled"
                    density="compact"
                    hide-details
                    :readonly="isGeneratingBulkVoiceSamples"
                ></v-text-field>

                <div class="d-flex flex-column mt-5">
                    <div class="mb-1">
                        <p class="mb-0">スタイルの強さ（適切に発声できる最適値がモデルによって異なるため、適宜調整が必要）</p>
                    </div>
                    <v-slider
                        v-model="intonationScale"
                        min="0"
                        max="2"
                        step="0.05"
                        :disabled="isGeneratingBulkVoiceSamples"
                        color="primary"
                        density="compact"
                        show-ticks="always"
                        thumb-label
                        hide-details
                    ></v-slider>
                    <div class="mb-1 mt-2">
                        <p class="mb-0">話速（値が大きいほど速く話し、値が小さいほどゆっくり話す）</p>
                    </div>
                    <v-slider
                        v-model="speedScale"
                        min="0.5"
                        max="2"
                        step="0.05"
                        :disabled="isGeneratingBulkVoiceSamples"
                        color="primary"
                        density="compact"
                        show-ticks="always"
                        thumb-label
                        hide-details
                    ></v-slider>
                    <div class="mb-1 mt-2">
                        <p class="mb-0">テンポの緩急（値が大きいほど、より早口で生っぽい抑揚がついた声になる）</p>
                    </div>
                    <v-slider
                        v-model="tempoDynamicsScale"
                        min="0"
                        max="2"
                        step="0.05"
                        :disabled="isGeneratingBulkVoiceSamples"
                        color="primary"
                        density="compact"
                        show-ticks="always"
                        thumb-label
                        hide-details
                    ></v-slider>
                </div>

                <v-progress-linear
                    v-if="isGeneratingBulkVoiceSamples"
                    class="mt-4"
                    :model-value="bulkGenerationProgress"
                    color="primary"
                    height="20"
                    stream
                    rounded
                >
                    <template v-slot:default="{ value }">
                        <strong style="color: white;">{{ Math.ceil(value) }}% ({{ bulkGenerationCurrentStep }} / {{ bulkGenerationTotalSteps }})</strong>
                    </template>
                </v-progress-linear>
                <p v-if="bulkGenerationStatusMessage" class="mt-2" style="font-size: 13px; text-align: center; min-height: 18px;">
                    {{ bulkGenerationStatusMessage }}
                </p>
            </v-card-text>
            <v-card-actions class="px-6 pb-5 pt-0">
                <v-spacer></v-spacer>
                <v-btn
                    color="grey"
                    variant="text"
                    @click="cancelGeneration"
                >
                    {{ isGeneratingBulkVoiceSamples ? 'キャンセル' : '閉じる' }}
                </v-btn>
                <v-btn
                    color="grey"
                    variant="text"
                    :disabled="isGeneratingBulkVoiceSamples"
                    @click="resetToDefaults"
                >
                    リセット
                </v-btn>
                <v-btn
                    color="primary"
                    variant="flat"
                    :loading="isGeneratingBulkVoiceSamples && bulkGenerationStatusMessage.includes('準備中')"
                    @click="startGeneration"
                    :disabled="isGeneratingBulkVoiceSamples || !isFFmpegLoaded || bulkGenerationTextsInput.trim() === ''"
                >
                    生成開始
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>

import { FFmpeg } from '@ffmpeg/ffmpeg';
import Aivmlib, { AivmMetadata } from 'aivmlib-web';
import md5 from 'crypto-js/md5';
import * as uuid from 'uuid';
import { ref, computed, watch, PropType, defineProps, defineEmits, onMounted } from 'vue';

import Message from '@/message';
import Utils from '@/utils';

const props = defineProps({
    modelValue: Boolean,
    ffmpegInstance: {
        type: Object as PropType<FFmpeg>,
        required: true,
    },
    isFFmpegLoaded: {
        type: Boolean,
        required: true,
    },
    currentMetadata: {
        type: Object as PropType<AivmMetadata | null>,
        default: null,
    },
    replacementOnnxModel: { // 差し替えモード用の AIVMX ファイル
        type: Object as PropType<File | null>,
        default: null,
    },
    selectedOnnxModel: { // 新規生成用の AIVMX ファイルの元となる ONNX ファイル
        type: Object as PropType<File | null>,
        default: null,
    },
    selectedAivmxFile: { // 一時インストール用の潜在的なソースとなる AIVMX ファイル
        type: Object as PropType<File | null>,
        default: null,
    },
    isReplacementMode: {
        type: Boolean,
        required: true,
    },
    isAllReplacementFilesSelected: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['complete', 'cancel']);

// localStorage のキー定数
const STORAGE_KEYS = {
    BULK_GENERATION_TEXTS: 'AIVMGenerator-BulkGenerationTexts',
    INTONATION_SCALE: 'AIVMGenerator-IntonationScale',
    SPEED_SCALE: 'AIVMGenerator-SpeedScale',
    TEMPO_DYNAMICS_SCALE: 'AIVMGenerator-TempoDynamicsScale',
};

// デフォルトテキスト
const DEFAULT_TEXTS =
    'おはようございます！現在時刻は7時30分です。今日の東京の気温は18度で、天気は雨です。10時からミーティング、午後3時に歯医者の予約があります。今日も素敵な一日になりますように。\n' +
    'やった〜！テストでようやく満点取れた〜！めちゃくちゃ嬉しい…。　そうそう、さっき読んでたこの漫画がめっちゃ面白くてさ〜！見てよこれ！\n' +
    'ごめんね、今ちょっと風邪気味なんだよね…。それでもよければ会いたいけど、どう？　…………そっか…。コロナ流行ってるもんね。じゃまた今度にしようか。…元気になったらぜひご飯でも！';

// デフォルト値定数
const DEFAULT_VALUES = {
    INTONATION_SCALE: 1.3,
    SPEED_SCALE: 1.0,
    TEMPO_DYNAMICS_SCALE: 1.0,
};

// --- コンポーネントの状態 ---
const bulkGenerationTextsInput = ref('');
const bulkGenerationTexts = computed(() => bulkGenerationTextsInput.value.split('\n').map(t => t.trim()).filter(t => t !== ''));
const aivisSpeechApiBaseUrl = ref('http://localhost:10101');
const intonationScale = ref(DEFAULT_VALUES.INTONATION_SCALE); // デフォルト値、各話者でスタイルを少し強めに出すために 1.3 に設定
const speedScale = ref(DEFAULT_VALUES.SPEED_SCALE); // デフォルト値
const tempoDynamicsScale = ref(DEFAULT_VALUES.TEMPO_DYNAMICS_SCALE); // デフォルト値
const isGeneratingBulkVoiceSamples = ref(false);
const bulkGenerationProgress = ref(0);
const bulkGenerationCurrentStep = ref(0);
const bulkGenerationTotalSteps = ref(0);
const bulkGenerationStatusMessage = ref('');
const isModelTemporarilyInstalled = ref(false);
const temporaryModelUuid = ref<string | null>(null);
let bulkGenerationAbortController: AbortController | null = null;
// --- コンポーネントの状態ここまで ---

// localStorage から値を読み込む関数
function loadFromLocalStorage() {
    try {
        // テキストの読み込み
        const savedTexts = localStorage.getItem(STORAGE_KEYS.BULK_GENERATION_TEXTS);
        if (savedTexts) {
            bulkGenerationTextsInput.value = savedTexts;
        } else {
            bulkGenerationTextsInput.value = DEFAULT_TEXTS;
        }

        // intonationScale の読み込み
        const savedIntonationScale = localStorage.getItem(STORAGE_KEYS.INTONATION_SCALE);
        if (savedIntonationScale) {
            const parsedValue = parseFloat(savedIntonationScale);
            if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 2) {
                intonationScale.value = parsedValue;
            }
        }

        // speedScale の読み込み
        const savedSpeedScale = localStorage.getItem(STORAGE_KEYS.SPEED_SCALE);
        if (savedSpeedScale) {
            const parsedValue = parseFloat(savedSpeedScale);
            if (!isNaN(parsedValue) && parsedValue >= 0.5 && parsedValue <= 2) {
                speedScale.value = parsedValue;
            }
        }

        // tempoDynamicsScale の読み込み
        const savedTempoDynamicsScale = localStorage.getItem(STORAGE_KEYS.TEMPO_DYNAMICS_SCALE);
        if (savedTempoDynamicsScale) {
            const parsedValue = parseFloat(savedTempoDynamicsScale);
            if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 2) {
                tempoDynamicsScale.value = parsedValue;
            }
        }
    } catch (ex) {
        console.warn('localStorage からの読み込みに失敗しました:', ex);
        // エラーの場合はデフォルト値を設定
        resetToDefaults();
    }
}

// localStorage に値を保存する関数
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.BULK_GENERATION_TEXTS, bulkGenerationTextsInput.value);
        localStorage.setItem(STORAGE_KEYS.INTONATION_SCALE, intonationScale.value.toString());
        localStorage.setItem(STORAGE_KEYS.SPEED_SCALE, speedScale.value.toString());
        localStorage.setItem(STORAGE_KEYS.TEMPO_DYNAMICS_SCALE, tempoDynamicsScale.value.toString());
    } catch (ex) {
        console.warn('localStorage への保存に失敗しました:', ex);
    }
}

// デフォルト値にリセットする関数
function resetToDefaults() {
    bulkGenerationTextsInput.value = DEFAULT_TEXTS;
    intonationScale.value = DEFAULT_VALUES.INTONATION_SCALE;
    speedScale.value = DEFAULT_VALUES.SPEED_SCALE;
    tempoDynamicsScale.value = DEFAULT_VALUES.TEMPO_DYNAMICS_SCALE;
}

// コンポーネントマウント時に localStorage から値を読み込み
onMounted(() => {
    loadFromLocalStorage();
});

// 値が変更されたときに localStorage に保存
watch(bulkGenerationTextsInput, saveToLocalStorage);
watch(intonationScale, saveToLocalStorage);
watch(speedScale, saveToLocalStorage);
watch(tempoDynamicsScale, saveToLocalStorage);

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        // ダイアログが開いたときに他の状態のみリセット（テキストとパラメータは保持）
        bulkGenerationProgress.value = 0;
        bulkGenerationCurrentStep.value = 0;
        bulkGenerationTotalSteps.value = 0;
        bulkGenerationStatusMessage.value = '';
        isGeneratingBulkVoiceSamples.value = false;
        isModelTemporarilyInstalled.value = false;
        temporaryModelUuid.value = null;
        bulkGenerationAbortController = null;
    }
});

/**
 * ローカルスタイル ID と話者 UUID から VOICEVOX ENGINE API 互換のグローバルなスタイル ID を計算する
 * Python 実装に合わせて BigInt を使用して計算精度を確保
 * ref: https://github.com/Aivis-Project/AivisSpeech-Engine/blob/master/voicevox_engine/aivm_infos_repository.py#L572-L619
 */
function localStyleIdToGlobalStyleId(localStyleId: number, speakerUuid: string): number {
    // BigInt を使用して定数を定義
    const MAX_UUID_BITS = 27n;
    const UUID_BIT_MASK = (1n << MAX_UUID_BITS) - 1n;
    const LOCAL_STYLE_ID_BITS = 5n;
    const LOCAL_STYLE_ID_MASK = (1n << LOCAL_STYLE_ID_BITS) - 1n;
    const SIGN_BIT = 1n << 31n;

    if (!speakerUuid) {
        throw new Error('speaker_uuid は空でない文字列である必要があります。');
    }
    // localStyleId が有効な範囲内の整数であることを確認
    if (!(Number.isInteger(localStyleId) && localStyleId >= 0 && localStyleId <= 31)) {
        throw new Error(`local_style_id は 0 から 31 の整数である必要があります。値: ${localStyleId}`);
    }

    // crypto-js を使用して MD5 ハッシュを計算 (16進数文字列)
    const hashHex = md5(speakerUuid).toString();

    // 完全な16進数ハッシュ文字列を BigInt としてパースし、下位27ビットにマスク
    // BigInt コンストラクタは '0x' プレフィックスを受け付けます
    const uuidHashBigInt = BigInt('0x' + hashHex) & UUID_BIT_MASK;

    // ローカルスタイル ID を BigInt に変換し、5ビットにマスク (Number で計算しても良いが BigInt に合わせる)
    // マスク処理は念のため BigInt で行う
    const localStyleIdBigInt = BigInt(localStyleId) & LOCAL_STYLE_ID_MASK;

    // 結合: uuidHashBigInt を5ビット左シフトし、localStyleIdBigInt と OR する (すべて BigInt で計算)
    let combinedIdBigInt = (uuidHashBigInt << LOCAL_STYLE_ID_BITS) | localStyleIdBigInt;

    // 符号ビットの処理: 32ビット目（SIGN_BIT）が設定されている場合、クリア (BigInt で計算)
    // Python 実装に合わせて、符号ビットが立っている場合はクリアする
    if ((combinedIdBigInt & SIGN_BIT) !== 0n) { // BigInt との比較
        combinedIdBigInt &= ~SIGN_BIT; // BigInt のビット演算
    }

    // BigInt の結果を Number に変換して返す
    // 結果は 32 ビット符号なし整数の範囲に収まるはず
    const combinedId = Number(combinedIdBigInt);

    // 最終結果が正の整数であり、Number で安全に表現できることを確認
    if (!Number.isSafeInteger(combinedId) || combinedId < 0) {
        // このケースが発生した場合、予期せぬ問題や BigInt から Number への変換エラーを示す
        throw new Error('生成された combinedId が無効か、安全な整数範囲外です。ロジックエラーの可能性: ' + combinedIdBigInt.toString());
    }

    // ログ出力も BigInt を考慮して調整
    console.log(`UUID: ${speakerUuid}, LocalID: ${localStyleId}, HashHex: ${hashHex}, uuidHashBigInt(hex): ${uuidHashBigInt.toString(16)}, Combined: ${combinedId} (${combinedId.toString(16)})`);
    return combinedId;
}

/**
 * AivisSpeech Engine API の疎通確認
 */
async function checkAivisSpeechAvailability(baseUrl: string): Promise<boolean> {
    try {
        const response = await fetch(`${baseUrl}/version`, {
            signal: bulkGenerationAbortController?.signal,
            cache: 'no-cache',
            mode: 'cors', // モードを明示的に設定
        });
        return response.ok;
    } catch (ex) {
        if (ex instanceof Error && ex.name === 'AbortError') return false;
        console.error('AivisSpeech Engine API への接続に失敗しました:', ex);
        return false;
    }
}

/**
 * AivisSpeech から AIVM 音声合成モデルの情報を取得する
 */
async function getAivmInfo(baseUrl: string, uuid: string): Promise<any | null> {
    try {
        const response = await fetch(`${baseUrl}/aivm_models/${uuid}`, {
            signal: bulkGenerationAbortController?.signal,
            cache: 'no-cache',
            mode: 'cors',
        });
        if (response.status === 404) {
            return null; // 見つからない
        }
        if (!response.ok) {
            const errorText = await response.text().catch(() => '不明なエラー');
            throw new Error(`音声合成モデル情報の取得に失敗しました。(HTTP ${response.status}) UUID ${uuid}: ${errorText}`);
        }
        return await response.json();
    } catch (ex) {
        if (ex instanceof Error && ex.name === 'AbortError') throw ex;
        console.error(`UUID ${uuid} の音声合成モデル情報の取得に失敗しました:`, ex);
        throw new Error(`AivisSpeech から音声合成モデル情報 (${uuid}) の取得に失敗しました: ${(ex as Error).message}`);
    }
}

/**
 * AivisSpeech に一時的に AIVM 音声合成モデルをインストールする
 */
async function installTemporaryAivmxFile(baseUrl: string, file: File, targetUuid: string): Promise<void> {
    try {
        const formData = new FormData();
        formData.append('file', file, `${targetUuid}.aivmx`);
        const response = await fetch(`${baseUrl}/aivm_models/install`, {
            method: 'POST',
            body: formData,
            signal: bulkGenerationAbortController?.signal,
            mode: 'cors',
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => '不明なエラー');
            throw new Error(`一時モデルのインストールに失敗しました。(UUID: ${targetUuid}, HTTP ${response.status}): ${errorText}`);
        }
        console.log(`一時モデルが UUID: ${targetUuid} でインストールされました。`);
        await Utils.sleep(3); // インストールの完了を待つ
    } catch (ex) {
        if (ex instanceof Error && ex.name === 'AbortError') throw ex;
        console.error(`一時モデル (UUID: ${targetUuid}) のインストールに失敗しました:`, ex);
        throw new Error(`AivisSpeech への一時モデル (UUID: ${targetUuid}) のインストールに失敗しました: ${(ex as Error).message}`);
    }
}

/**
 * AivisSpeech から一時的にインストールされた音声合成モデルをアンインストールする
 */
async function uninstallTemporaryAivmxFile(baseUrl: string, uuid: string): Promise<void> {
    if (!uuid) return;
    console.log(`一時モデルのアンインストールを試みます: ${uuid}`);
    try {
        const cleanupController = new AbortController();
        const timeoutId = setTimeout(() => {
            console.warn(`UUID: ${uuid} のアンインストールがタイムアウトしました。`);
            cleanupController.abort();
        }, 30 * 1000); // 30秒でタイムアウト

        // 1. 最初にモデルをアンロード
        console.log(`一時モデル ${uuid} をアンロード中...`);
        const unloadResponse = await fetch(`${baseUrl}/aivm_models/${uuid}/unload`, {
            method: 'POST',
            signal: cleanupController.signal,
            mode: 'cors',
        });

        if (!unloadResponse.ok && unloadResponse.status !== 404) {
            console.warn(`一時モデル ${uuid} のアンロードに失敗しました: HTTP ${unloadResponse.status}`);
            // アンロード失敗でもアンインストールは試行
        } else if (unloadResponse.ok) {
            console.log(`一時モデル ${uuid} のアンロードに成功しました。`);
        }

        // 2. アンロード後にアンインストール
        const response = await fetch(`${baseUrl}/aivm_models/${uuid}/uninstall`, {
            method: 'DELETE',
            signal: cleanupController.signal,
            mode: 'cors',
        });
        clearTimeout(timeoutId);

        if (!response.ok && response.status !== 404) { // 404は無視
            const errorText = await response.text().catch(() => `HTTP ${response.status}`);
            console.error(`一時モデルのアンインストールに失敗しました。(UUID: ${uuid}, ${errorText})。`);
            Message.warning(`一時モデル (${uuid}) のアンインストールに失敗しました。手動確認を推奨します。`);
        } else if (response.ok) {
            console.log(`一時モデルのアンインストールに成功しました: ${uuid}`);
        } else {
            console.log(`一時モデル ${uuid} はアンインストール時に見つかりませんでした。（既に削除済み？）`);
        }
    } catch (ex) {
        if (ex instanceof Error && ex.name === 'AbortError') {
            // タイムアウトによる警告済み
            Message.warning(`一時モデル (${uuid}) のアンインストールがタイムアウトしました。手動確認を推奨します。`);
        } else {
            console.error(`一時モデル (UUID: ${uuid}) のアンインストール中にエラーが発生しました:`, ex);
            Message.warning(`一時モデル (${uuid}) のアンインストール中にエラーが発生しました。手動確認を推奨します。`);
        }
    }
}

/**
 * AivisSpeech で音声合成を実行し、WAV Blob を取得する
 */
async function synthesizeSpeech(baseUrl: string, text: string, styleId: number): Promise<Blob> {
    try {
        // 1. audio_query
        const queryParams = new URLSearchParams({ speaker: styleId.toString(), text: text });
        const queryResponse = await fetch(`${baseUrl}/audio_query?${queryParams.toString()}`, {
            method: 'POST',
            signal: bulkGenerationAbortController?.signal,
            cache: 'no-cache',
            mode: 'cors',
        });
        if (!queryResponse.ok) {
            const errorText = await queryResponse.text().catch(() => `HTTP ${queryResponse.status}`);
            throw new Error(`/audio_query API の実行に失敗しました。(${errorText}) スタイル: ${styleId}`);
        }
        const audioQuery = await queryResponse.json();
        // フォームで設定された値を使用
        audioQuery.intonationScale = intonationScale.value;
        audioQuery.speedScale = speedScale.value;
        audioQuery.tempoDynamicsScale = tempoDynamicsScale.value;

        // 2. synthesis
        const synthesisResponse = await fetch(`${baseUrl}/synthesis?speaker=${styleId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'audio/wav' },
            body: JSON.stringify(audioQuery),
            signal: bulkGenerationAbortController?.signal,
            mode: 'cors',
        });
        if (!synthesisResponse.ok) {
            const errorText = await synthesisResponse.text().catch(() => `HTTP ${synthesisResponse.status}`);
            throw new Error(`音声合成 API の実行に失敗しました。(${errorText}) スタイル: ${styleId}`);
        }
        const contentType = synthesisResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('audio/wav')) {
            console.warn(`音声合成レスポンスの Content-Type が予期せぬ値です: ${contentType}`);
        }
        return await synthesisResponse.blob();
    } catch (ex) {
        if (ex instanceof Error && ex.name === 'AbortError') throw ex;
        console.error(`スタイル ${styleId} の音声合成に失敗しました:`, ex);
        throw new Error(`AivisSpeech での音声合成に失敗しました。(Style ID: ${styleId}): ${(ex as Error).message}`);
    }
}

/**
 * 一括生成のメイン処理ロジック
 */
async function generateBulkVoiceSamples() {
    if (!props.currentMetadata || !props.isFFmpegLoaded) return;

    // ローカルで変更するためのディープコピーを作成し、完全成功時のみ結果を送信
    // vuedraggable で順序を並び替えた場合、toRawDeep で再帰的に toRaw しないと structuredClone でコピーできない
    const localMetadataCopy = structuredClone(Utils.toRawDeep(props.currentMetadata));
    console.log(props.currentMetadata);
    console.log(localMetadataCopy);

    bulkGenerationAbortController = new AbortController();
    isGeneratingBulkVoiceSamples.value = true;
    isModelTemporarilyInstalled.value = false;
    temporaryModelUuid.value = null; // 一時モデルの UUID
    let tempSpeakerUuidMap = new Map<string, string>(); // 元のUUID -> 一時UUID のマッピング

    bulkGenerationProgress.value = 0;
    bulkGenerationCurrentStep.value = 0;
    bulkGenerationStatusMessage.value = '処理を準備中...';

    const targetStyles: {
        originalSpeakerUuid: string; // 元の UUID をマッピング用に保持
        speakerName: string;
        speakerLocalId: number; // メタデータ内の話者ローカル ID
        styleLocalId: number;   // メタデータ内のスタイルローカル ID (0-31)
        styleName: string;
    }[] = [];
    localMetadataCopy.manifest.speakers.forEach(speaker => {
        speaker.styles.forEach(style => {
            targetStyles.push({
                originalSpeakerUuid: speaker.uuid, // 元の UUID を保存
                speakerName: speaker.name,
                speakerLocalId: speaker.local_id,
                styleLocalId: style.local_id, // 0-31 のローカル ID
                styleName: style.name,
            });
        });
    });
    bulkGenerationTotalSteps.value = bulkGenerationTexts.value.length * targetStyles.length;

    const originalModelUuid = localMetadataCopy.manifest.uuid;
    const originalVersion = localMetadataCopy.manifest.version;
    const baseUrl = aivisSpeechApiBaseUrl.value;
    let modelUuidToUseInApi: string = originalModelUuid; // API 操作に使うモデル UUID (一時 or 元)
    let aivmInfoFromApi: any | null = null;  // API から取得したモデル情報 (一時インストール確認などに使用)

    try {
        // 1. API 利用可能性の確認
        bulkGenerationStatusMessage.value = `AivisSpeech (${baseUrl}) の接続を確認中...`;
        if (!(await checkAivisSpeechAvailability(baseUrl))) {
            throw new Error(`AivisSpeech Engine API (${baseUrl}) に接続できませんでした。`);
        }

        // 2. 一時インストールが必要かどうかの判断
        bulkGenerationStatusMessage.value = `モデル (${originalModelUuid}) の情報を AivisSpeech から取得中...`;
        const existingInfo = await getAivmInfo(baseUrl, originalModelUuid).catch(err => {
            console.warn(`元のUUID ${originalModelUuid} の情報を取得できませんでした。一時インストールチェックに進みます。エラー: ${err.message}`);
            return null; // 安全のため、情報取得エラーを「見つからない」として扱う
        });

        let needsTemporaryInstall = false;
        if (!existingInfo) {
            needsTemporaryInstall = true;
            bulkGenerationStatusMessage.value = 'モデル未検出。一時インストールが必要です。';
        } else if (existingInfo.manifest.version !== originalVersion) {
            needsTemporaryInstall = true;
            bulkGenerationStatusMessage.value = `バージョン不一致 (${existingInfo.manifest.version} vs ${originalVersion})。一時インストールが必要です。`;
        } else if (props.isReplacementMode && props.isAllReplacementFilesSelected) {
            needsTemporaryInstall = true;
            bulkGenerationStatusMessage.value = 'モデル差し替えモード。一時インストールが必要です。';
        }

        // 3. 一時インストール（必要な場合）
        if (needsTemporaryInstall) {
            isModelTemporarilyInstalled.value = true;
            const tempUuid = uuid.v4();
            temporaryModelUuid.value = tempUuid; // クリーンアップ用に保存
            modelUuidToUseInApi = tempUuid; // 以降の API 呼び出しに一時 UUID を使用

            bulkGenerationStatusMessage.value = `一時モデル (UUID: ${tempUuid}) を準備中...`;

            // 新しい UUID を持つ一時メタデータを作成
            const tempMetadataForInstall = structuredClone(localMetadataCopy);
            tempMetadataForInstall.manifest.uuid = tempUuid;
            tempSpeakerUuidMap = new Map<string, string>(); // マップをリセット
            tempMetadataForInstall.manifest.speakers.forEach(spk => {
                const originalUUID = spk.uuid; // 上書き前に元の UUID を取得
                const newSpeakerUuid = uuid.v4(); // 一時的な話者 UUID を生成
                tempSpeakerUuidMap.set(originalUUID, newSpeakerUuid); // 元 UUID -> 一時 UUID のマッピングを保存
                spk.uuid = newSpeakerUuid; // メタデータ内の話者 UUID を一時的なものに更新
            });

            // 一時 AIVMX ファイルのソースを準備
            let sourceModelFileForTemp: File | null = null;
            // モードに基づいてソースファイルを決定
            if (props.isReplacementMode && props.isAllReplacementFilesSelected) {
                sourceModelFileForTemp = props.replacementOnnxModel; // .onnx または .aivmx のいずれか
            } else if (!props.isReplacementMode && props.selectedOnnxModel) {
                sourceModelFileForTemp = props.selectedOnnxModel; // 新規生成用の .onnx
            } else if (!props.isReplacementMode && props.selectedAivmxFile) {
                // 既存の編集の場合、選択された AIVMX を一時ファイルのベースとして使用
                sourceModelFileForTemp = props.selectedAivmxFile;
            }

            if (!sourceModelFileForTemp) {
                throw new Error('一時インストール用の元となるモデルファイルの特定に失敗しました。');
            }

            bulkGenerationStatusMessage.value = `一時 AIVMX ファイル (UUID: ${tempUuid}) を生成中...`;
            // Aivmlib はソースファイルと変更されたメタデータ（一時 UUID 付き）が必要
            const tempAivmxBlob = await Aivmlib.writeAivmxMetadata(sourceModelFileForTemp, tempMetadataForInstall);
            const tempAivmxFile = new File([tempAivmxBlob], `${tempUuid}.aivmx`, { type: 'application/octet-stream' });

            bulkGenerationStatusMessage.value = `一時モデル (UUID: ${tempUuid}) を AivisSpeech にインストール中...`;
            await installTemporaryAivmxFile(baseUrl, tempAivmxFile, tempUuid);

            bulkGenerationStatusMessage.value = `一時モデル (UUID: ${tempUuid}) の情報を AivisSpeech から取得中...`;
            // aivmInfoFromApi は必要に応じて一時モデルの情報を保持するが、スタイル ID 生成には直接使わない
            aivmInfoFromApi = await getAivmInfo(baseUrl, tempUuid);
            if (!aivmInfoFromApi) {
                throw new Error(`一時モデル (UUID: ${tempUuid}) のインストール後、情報取得に失敗。`);
            }
            console.log(`一時モデル ${tempUuid} がインストールされました。話者 UUID マッピング:`, tempSpeakerUuidMap);
        } else {
            // 既存のモデル情報を使用
            modelUuidToUseInApi = originalModelUuid;
            aivmInfoFromApi = existingInfo; // これは主にバージョン確認用
            if (!aivmInfoFromApi) { // needsTemporaryInstall=false であれば発生しないはず
                throw new Error(`既存モデル (${originalModelUuid}) の情報取得に失敗。`);
            }
            bulkGenerationStatusMessage.value = `既存モデル (UUID: ${modelUuidToUseInApi}, Ver: ${aivmInfoFromApi.manifest.version}) を使用します。`;
        }

        // 4. グローバルスタイル ID の計算とマッピング
        bulkGenerationStatusMessage.value = 'グローバルスタイル ID を計算中...';
        const globalStyleIdMap = new Map<string, number>(); // キー: originalSpeakerUuid-styleLocalId, 値: globalStyleId

        // targetStyles (ローカルメタデータ由来) をループして、各スタイルに対応するグローバルスタイル ID を計算する
        for (const targetStyle of targetStyles) {
            let speakerUuidForIdCalculation: string;

            // 一時インストールの場合、対応する一時的な話者 UUID を取得する
            if (isModelTemporarilyInstalled.value) {
                const tempSpeakerUuid = tempSpeakerUuidMap.get(targetStyle.originalSpeakerUuid);
                if (!tempSpeakerUuid) {
                    console.warn(`話者 ${targetStyle.speakerName} (元 UUID ${targetStyle.originalSpeakerUuid}) に対応する一時UUIDが見つかりません。この話者のスタイルをスキップします。`);
                    continue; // マッピングがない場合はスキップ
                }
                speakerUuidForIdCalculation = tempSpeakerUuid;
            } else {
                // 一時インストールでない場合は、元の話者 UUID をそのまま使用
                speakerUuidForIdCalculation = targetStyle.originalSpeakerUuid;
            }

            try {
                // localStyleIdToGlobalStyleId 関数を使い、ローカルID (0-31) と (一時または元の) 話者 UUID からグローバル ID を計算
                const globalId = localStyleIdToGlobalStyleId(targetStyle.styleLocalId, speakerUuidForIdCalculation);

                // マップキーには *元の* UUID とローカルスタイル ID を使用
                const mapKey = `${targetStyle.originalSpeakerUuid}-${targetStyle.styleLocalId}`;
                globalStyleIdMap.set(mapKey, globalId);
                console.log(`Calculated Global ID: ${globalId} for Speaker (Original UUID): ${targetStyle.originalSpeakerUuid}, Speaker (for calc): ${speakerUuidForIdCalculation}, Style Local ID: ${targetStyle.styleLocalId}`);

            } catch (err: any) {
                console.error(`スタイル (話者: ${targetStyle.speakerName}, 元UUID: ${targetStyle.originalSpeakerUuid}, スタイル: ${targetStyle.styleName}, ローカルID: ${targetStyle.styleLocalId}) のグローバルスタイル ID 計算に失敗:`, err);
                // エラーが発生した場合でも処理を続行するか、ここで中断するか検討が必要
                // ここではエラーをスローして全体を中断させる
                throw new Error(`グローバルスタイルIDの計算に失敗しました: ${err.message}`);
            }
        }

        console.log('Global Style ID Map:', globalStyleIdMap);

        // 5. 音声合成とエンコードのループ
        for (const text of bulkGenerationTexts.value) {
            for (const targetStyle of targetStyles) {
                // 頻繁に中断シグナルをチェック
                if (bulkGenerationAbortController?.signal.aborted) {
                    throw new Error('操作がキャンセルされました');
                }

                const progress = (bulkGenerationCurrentStep.value / bulkGenerationTotalSteps.value) * 100;
                bulkGenerationCurrentStep.value++;
                bulkGenerationProgress.value = progress;
                bulkGenerationStatusMessage.value = `[${bulkGenerationCurrentStep.value}/${bulkGenerationTotalSteps.value}] 話者: ${targetStyle.speakerName}, スタイル: ${targetStyle.styleName}`;

                // *元の* UUID と *ローカル* スタイルID を使って、計算済みのグローバルスタイル ID を検索
                const mapKey = `${targetStyle.originalSpeakerUuid}-${targetStyle.styleLocalId}`;
                const globalStyleId = globalStyleIdMap.get(mapKey);

                if (globalStyleId === undefined) {
                    // ステップ4でマッピングが見つからなかったスタイルはスキップされているはずだが、念のためチェック
                    console.warn(`計算済みグローバルスタイル ID が見つからないためスタイルをスキップ: 話者 ${targetStyle.speakerName} (元 UUID ${targetStyle.originalSpeakerUuid}), スタイル ${targetStyle.styleName} (ローカル ID ${targetStyle.styleLocalId}) (キー: ${mapKey})`);
                    continue;
                }

                // 計算された globalStyleId を使って音声合成
                bulkGenerationStatusMessage.value = `[${bulkGenerationCurrentStep.value}/${bulkGenerationTotalSteps.value}] 話者: ${targetStyle.speakerName}, スタイル: ${targetStyle.styleName} (ID: ${globalStyleId}) 音声合成中...`;
                const wavBlob = await synthesizeSpeech(baseUrl, text, globalStyleId);

                // M4A にエンコード
                bulkGenerationStatusMessage.value = `[${bulkGenerationCurrentStep.value}/${bulkGenerationTotalSteps.value}] 話者: ${targetStyle.speakerName}, スタイル: ${targetStyle.styleName} (ID: ${globalStyleId}) M4A エンコード中...`;
                const wavFile = new File([wavBlob], 'temp.wav', { type: 'audio/wav' });
                const m4aDataUrl = await Utils.encodeAudioToM4ADataURL(wavFile, props.ffmpegInstance);

                // --- ローカルメタデータコピーを更新 ---
                // *元の* UUID とローカル ID を使って、ローカルコピー内の正しい話者とスタイルを見つける
                const speakerToUpdate = localMetadataCopy.manifest.speakers.find(s => s.uuid === targetStyle.originalSpeakerUuid);
                const styleToUpdate = speakerToUpdate?.styles.find(s => s.local_id === targetStyle.styleLocalId);

                if (styleToUpdate) {
                    styleToUpdate.voice_samples.push({ audio: m4aDataUrl, transcript: text });
                } else {
                    console.error(`ローカルメタデータコピーで更新する話者/スタイルが見つかりません: 話者 ${targetStyle.originalSpeakerUuid}, スタイル ${targetStyle.styleLocalId}`);
                }
                await Utils.sleep(0.05); // UI 更新のための小休止
            }
        }

        bulkGenerationStatusMessage.value = 'ボイスサンプルの一括生成が完了しました。';
        Message.success('ボイスサンプルの一括生成が完了しました。');
        emit('complete', localMetadataCopy); // 正常に更新されたメタデータを送信

    } catch (ex: any) {
        console.error('ボイスサンプル一括生成に失敗:', ex);
        if (ex.name !== 'AbortError') { // ユーザーによる中断の場合はエラーメッセージを表示しない
            Message.error(`一括生成エラー: ${ex.message}`);
            bulkGenerationStatusMessage.value = `エラー: ${ex.message}`;
        } else {
            bulkGenerationStatusMessage.value = '処理がキャンセルされました。';
            Message.info('ボイスサンプルの一括生成をキャンセルしました。');
        }
        emit('cancel'); // エラーかユーザーによる中断でキャンセルを送信

    } finally {
        // 6. 一時モデルのクリーンアップ（バックグラウンドで実行、待機しない）
        if (isModelTemporarilyInstalled.value && temporaryModelUuid.value) {
            bulkGenerationStatusMessage.value = `一時モデル (${temporaryModelUuid.value}) をクリーンアップ中...`;
            uninstallTemporaryAivmxFile(baseUrl, temporaryModelUuid.value).catch(err => {
                console.error('バックグラウンドアンインストール中のエラー:', err);
                // 重大ではない、uninstall 関数内ですでにログ出力済み
            }).finally(() => {
                // アンインストール試行が完了またはタイムアウト後にオプションでステータスメッセージを更新
                if (bulkGenerationStatusMessage.value.includes('クリーンアップ中')) {
                    // 生成中の場合はまだメッセージを変更しない（完了/エラーメッセージを上書きしないため）
                    if (isGeneratingBulkVoiceSamples.value) {
                        // 完了 or エラーメッセージが表示されているはずなので、上書きしない
                    } else {
                        // 既に isGeneratingBulkVoiceSamples が false ならメッセージを更新しても良い
                        bulkGenerationStatusMessage.value = bulkGenerationStatusMessage.value.replace('クリーンアップ中...', 'クリーンアップ完了（またはタイムアウト）。');
                    }
                }
            });
        }
        isGeneratingBulkVoiceSamples.value = false;
        bulkGenerationAbortController = null;
    }
}

/**
 * 生成を開始
 */
function startGeneration() {
    if (!props.currentMetadata) {
        Message.error('AIVM メタデータが読み込まれていません。');
        return;
    }
    if (!props.isFFmpegLoaded) {
        Message.error('FFmpeg がロードされていません。');
        return;
    }
    if (bulkGenerationTexts.value.length === 0) {
        Message.error('生成するテキストを1つ以上入力してください。');
        return;
    }
    generateBulkVoiceSamples();
}

/**
 * 生成をキャンセル/ダイアログを閉じる
 */
function cancelGeneration() {
    if (isGeneratingBulkVoiceSamples.value && bulkGenerationAbortController) {
        console.log('一括生成を中断中...');
        bulkGenerationStatusMessage.value = 'キャンセル処理中...';
        bulkGenerationAbortController.abort();
        // finally ブロックでキャンセル送信を処理させる
    } else {
        emit('cancel'); // 生成中でなければダイアログを閉じる
    }
}

</script>
<style scoped>

.v-card-text {
    font-size: 13.5px !important;
    line-height: 1.7 !important;
}

::v-deep(.v-progress-linear__content) {
    justify-content: center;
    color: white; /* プログレスバーのテキストを白色に */
    font-weight: bold;
}

</style>