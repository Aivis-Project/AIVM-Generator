<template>
    <main>
        <Description class="mt-3 px-5 py-3" style="border-left: 4px solid rgb(var(--v-theme-primary)); background-color: rgb(var(--v-theme-background-darken-1));
            word-break: keep-all; overflow-wrap: anywhere; line-height: 1.7;">
            <div class="d-flex align-center">
                <strong style="flex-shrink: 0;">🔔 お知らせ</strong>
                <div class="ml-5 d-flex flex-column" style="gap: 6px;">
                    <div>
                        <strong>✨ 既存の .aivm/.aivmx のメタデータ（UUID、アイコンなど）はそのままに、モデルデータだけを差し替えられるようになりました！</strong><br>
                        「各ファイルから新規生成」では新しいモデル UUID・話者 UUID が自動的に作成されますが、<br>
                        「既存の .aivm/.aivmx ファイルのメタデータを編集」では元の UUID がそのまま保持されます。<br>
                        AivisSpeech や AivisHub でも、メタデータ編集・モデルデータ差し替えを行う前と同一の音声合成モデルとして認識されます。
                    </div>
                    <div>
                        <strong>🔄 ボイスサンプルが WAV から M4A (AAC) 形式に自動変換されるようになりました！</strong><br>
                        WAV → M4A への変換により、生成後のモデルサイズが最大 10MB 以上削減されています！<br>
                    </div>
                    <div>
                        <strong>💾 以前生成した .aivm/.aivmx ファイルを「既存の .aivm/.aivmx ファイルのメタデータを編集」で選択するだけで、<br>
                        ボイスサンプルが自動的に WAV から M4A (AAC) 形式に変換されるようになりました！</strong><br>
                        モデルサイズを簡単に削減できますので、以前音声合成モデルを制作された方もぜひ一度お試しください！🙏
                    </div>
                </div>
            </div>
        </Description>
        <Description class="mt-4" style="word-break: keep-all; overflow-wrap: anywhere;">
            <strong>このサイトでは、<a class="link" href="https://aivis-project.com/speech/" target="_blank">AivisSpeech</a> などで使える AI 音声合成モデルファイル (AIVM / AIVMX) を、簡単に作成・編集できます。</strong>
        </Description>
        <Description class="mt-1">
            <b>AIVM</b> (<b>Ai</b>vis <b>V</b>oice <b>M</b>odel) / <b>AIVMX</b> (<b>Ai</b>vis <b>V</b>oice <b>M</b>odel for ONN<b>X</b>) は、学習済みモデル・ハイパーパラメータ・スタイルベクトル・話者メタデータ<wbr>（名前・概要・ライセンス・アイコン・ボイスサンプル など）を 1 つのファイルにギュッとまとめた、AI 音声合成モデル用オープンファイルフォーマットです。<br>
        </Description>
        <Description class="mt-3">
            <strong>この AIVM Generator では、ブラウザ上の GUI で AIVM / AIVMX ファイルを生成・編集できます。</strong><br>
            もちろん、既存の AIVM / AIVMX ファイル内の AIVM メタデータの確認・編集にも対応しています。<br>
            すべての処理はブラウザ上で行われます。入力情報がサーバーにアップロードされることはありません。<br>
        </Description>
        <Description class="mt-3 px-5 py-3" style="border-left: 4px solid rgb(var(--v-theme-primary)); background-color: rgb(var(--v-theme-background-darken-1));
            word-break: keep-all; overflow-wrap: anywhere;">
            <a class="link" href="https://github.com/Aivis-Project/aivmlib" target="_blank">aivmlib</a> / <a class="link" href="https://github.com/Aivis-Project/aivmlib-web" target="_blank">aivmlib-web</a> では、AIVM / AIVMX ファイル内のメタデータを読み書きするための Python / JavaScript (Web) 向け<wbr>ユーティリティライブラリを提供しています。詳しくは <a class="link" href="https://github.com/Aivis-Project/aivmlib#aivm-specification" target="_blank">AIVM Specification</a> をご参照ください。<br>
        </Description>
        <Heading2 class="mt-7">1. ファイル選択</Heading2>
        <Description class="mt-3">
            ファイル選択フォームへのドラッグ&ドロップ、またはクリックでファイルを選択できます。<br>
            現時点では、<a class="link" href="https://github.com/litagin02/Style-Bert-VITS2" target="_blank">Style-Bert-VITS2</a> で作成した音声合成モデルにのみ対応しています。<br>
            <div class="mt-1 spacer"></div>
            AIVM / AIVMX ファイルを生成するには、Safetensors (→ AIVM) 形式のモデルファイルだけでなく、ONNX (→ AIVMX) 形式のモデルファイルも必要です。<br>
            AIVM / AIVMX ファイルのメタデータの整合性を保つため、両方のファイルを同時に生成・編集する仕様となっています。<br>
        </Description>
        <Description class="mt-3 px-5 py-3" style="border-left: 4px solid rgb(var(--v-theme-primary)); background-color: rgb(var(--v-theme-background-darken-1));
            word-break: keep-all; overflow-wrap: anywhere;">
            <strong>Style-Bert-VITS2 で作成した Safetensors モデルはあるが、ONNX モデルをお持ちでない場合、下のフォームからかんたんに変換できます。</strong><br>
            「変換開始」ボタンを押すと、モデルファイルが変換サーバーに送信され、変換処理が始まります。変換には数分程度かかります。<br>
            変換が完了すると、ONNX モデルが自動的にダウンロードされます。変換後にサーバー上のファイルは直ちに削除されますので、ご安心ください。<br>
            ※現在開発中につきまだ動作しません（2025年4月中に実装予定）。今すぐ Style-Bert-VITS2 で作成したモデルを ONNX に変換したい方は最新の dev ブランチに切り替えた上で <a class="link" href="https://github.com/litagin02/Style-Bert-VITS2/blob/dev/convert_onnx.py" target="_blank">こちらの ONNX 変換スクリプト</a> をご利用ください（デベロッパー向け）。<br>
            <div class="mt-3 d-flex align-center" style="gap: 12px;">
                <div class="d-flex flex-column" style="flex: 1;">
                    <v-file-input variant="solo-filled" density="compact" show-size hide-details
                        label="学習済みモデル (.safetensors) を選択" accept=".safetensors" v-model="convertTargetModel" style="flex: 1;" />
                    <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                        label="ハイパーパラメータ (config.json) を選択" accept=".json"
                        v-model="convertTargetHyperParameters" />
                    <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                        label="スタイルベクトル (style_vectors.npy) を選択" accept=".npy" v-model="convertTargetStyleVectors" />
                </div>
                <v-btn color="primary" @click="convertModel" disabled>
                    変換開始
                </v-btn>
            </div>
        </Description>
        <v-tabs class="mt-0" color="primary" bg-color="transparent" align-tabs="center" v-model="selectionTypeTabIndex">
            <v-tab style="text-transform: none !important;"
                v-for="selectionType in ['各ファイルから新規生成', '既存の .aivm/.aivmx ファイルのメタデータを編集']" :key="selectionType">
                {{selectionType}}
            </v-tab>
        </v-tabs>
         <v-window v-model="selectionTypeTabIndex">
            <v-window-item class="pt-4 pb-5">
                <v-select variant="solo-filled" density="compact" hide-details :items="['Style-Bert-VITS2 (JP-Extra)', 'Style-Bert-VITS2']"
                    label="音声合成モデルのアーキテクチャを選択" v-model="selectedArchitecture" />
                <div class="d-flex" style="gap: 12px;">
                    <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                        label="学習済みモデル (.safetensors) を選択" accept=".safetensors" v-model="selectedSafetensorsModel" style="flex: 1;" />
                    <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                        label="ONNX モデル (.onnx) を選択" accept=".onnx" v-model="selectedOnnxModel" style="flex: 1;" />
                </div>
                <div>
                    <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                        label="ハイパーパラメータ (config.json) を選択" accept=".json"
                        v-model="selectedHyperParameters" />
                    <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                        label="スタイルベクトル (style_vectors.npy) を選択" accept=".npy" v-model="selectedStyleVectors" />
                </div>
            </v-window-item>
            <v-window-item class="pt-4 pb-5">
                <div class="d-flex" style="gap: 12px;">
                    <v-file-input variant="solo-filled" density="compact" show-size hide-details
                        label="AIVM ファイル (.aivm) を選択" accept=".aivm" v-model="selectedAivm" style="flex: 1;" />
                    <v-file-input variant="solo-filled" density="compact" show-size hide-details
                        label="AIVMX ファイル (.aivmx) を選択" accept=".aivmx" v-model="selectedAivmx" style="flex: 1;" />
                </div>

                <!-- モデル差し替えチェックボックス -->
                <v-checkbox class="mt-1" label="モデルデータと関連ファイルを差し替える" v-model="enableModelReplacement" hide-details />

                <!-- 差し替え用ファイル選択 (チェックボックスがオンの場合のみ表示) -->
                <div v-if="enableModelReplacement" class="mt-1">
                    <Description class="mt-0 mb-4 px-5 py-3" style="border-left: 4px solid rgb(var(--v-theme-primary)); background-color: rgb(var(--v-theme-background-darken-1));
                        word-break: keep-all; overflow-wrap: anywhere;">
                        既存の AIVM メタデータ (UUID, 名前, アイコン, ボイスサンプルなど) を維持したまま、モデルデータを更新します。<br>
                        ハイパーパラメータ (config.json) が変更された場合、話者やスタイルの構成が更新される可能性があります。
                    </Description>
                    <div class="d-flex" style="gap: 12px;">
                        <v-file-input variant="solo-filled" density="compact" show-size hide-details
                            label="差し替える学習済みモデル (.safetensors / .aivm)" accept=".safetensors,.aivm" v-model="replacementSafetensorsModel" style="flex: 1;"
                            :disabled="isModelReplacing" />
                        <v-file-input variant="solo-filled" density="compact" show-size hide-details
                            label="差し替える ONNX モデル (.onnx / .aivmx)" accept=".onnx,.aivmx" v-model="replacementOnnxModel" style="flex: 1;"
                            :disabled="isModelReplacing" />
                    </div>
                    <div>
                        <div class="d-flex align-center">
                            <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                                label="差し替えるハイパーパラメータ (config.json)" accept=".json" v-model="replacementHyperParameters"
                                :disabled="isModelReplacing" style="flex: 1;" />
                            <v-progress-circular v-if="isModelReplacing" class="ml-3" indeterminate color="primary" size="24" />
                        </div>
                        <div class="d-flex align-center">
                            <v-file-input variant="solo-filled" class="mt-3" density="compact" show-size hide-details
                                label="差し替えるスタイルベクトル (style_vectors.npy)" accept=".npy" v-model="replacementStyleVectors"
                                :disabled="isModelReplacing" style="flex: 1;" />
                            <v-progress-circular v-if="isModelReplacing" class="ml-3" indeterminate color="primary" size="24" />
                        </div>
                    </div>
                    <!-- 警告メッセージの表示 -->
                    <div v-if="modelReplacementWarnings.length > 0" class="mt-3">
                        <v-alert color="warning" variant="tonal" :border="'start'" density="compact"
                            class="py-3" style="font-size: 13.5px;">
                            <div class="d-flex align-center">
                                <strong>モデル差し替えによる変更点:</strong>
                            </div>
                            <ul class="ml-5 mt-1 mb-0">
                                <li v-for="(warning, index) in modelReplacementWarnings" :key="index">{{ warning }}</li>
                            </ul>
                        </v-alert>
                    </div>
                </div>
            </v-window-item>
         </v-window>
        <div class="d-flex align-center">
            <Heading2 class="mt-1">2. メタデータ編集</Heading2>
            <!-- 開発者モードのチェックボックス -->
            <v-checkbox class="ml-2 mt-1 developer-mode-checkbox" density="compact" hide-details color="transparent"
                v-model="developerMode" />
        </div>
        <Description class="mt-3">
            ここで設定したメタデータは、AIVM / AIVMX ファイル内に埋め込まれる <a class="link" href="https://github.com/Aivis-Project/aivmlib#aivm-manifest-specification-version-10" target="_blank">AIVM マニフェスト</a> に反映されます。<br>
            <div class="mt-1">
                音声合成モデル・話者の <a class="link" href="https://wa3.i-3-i.info/word13163.html" target="_blank">UUID</a> は自動生成されます。再度 AIVM / AIVMX ファイルのメタデータを編集しても UUID は変更されません。
            </div>
        </Description>
        <v-form ref="form" @submit.prevent>
            <div class="mt-5 d-flex" style="gap: 20px;">
                <div class="w-100">
                    <v-text-field variant="solo-filled" density="compact" hide-details
                        label="音声合成モデルの名前 (最大 80 文字 / 単独話者モデルでは話者名と自動同期されます)" :disabled="!isAllFilesSelected" v-model="aivmManifest.name"
                        :rules="[v => !!v || '音声合成モデルの名前は必須です。']" />
                    <v-combobox variant="solo-filled" class="mt-3" density="compact" hide-details
                        label="音声合成モデルの制作者 (複数追加・省略可)" :disabled="!isAllFilesSelected" v-model="aivmManifest.creators"
                        multiple chips closable-chips>
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-list-item-title>
                                    制作者名を入力し、Enter キーを押して追加してください。
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-combobox>
                    <div class="mt-2" style="margin-left: 5px; border-left: 3px solid rgb(var(--v-theme-text-darken-2)); padding-left: 10px;
                        font-size: 11px; color: rgb(var(--v-theme-text-darken-2));">
                        制作者名には <a class="link" href="https://docs.npmjs.com/cli/v10/configuring-npm/package-json#people-fields-author-contributors" target="_blank">npm package.json の "author", "contributors" に指定できるもの</a> と同じ書式を利用できます。<br>
                        例: "John Doe" / "Jane Doe &lt;jane.doe@example.com&gt;" / "John Doe &lt;john.doe@example.com&gt; (https://example.com)"
                    </div>
                    <v-textarea variant="solo-filled" class="mt-3" density="compact" rows="4" hide-details
                        label="音声合成モデルの簡潔な説明 (最大 140 文字 / 省略可)" :disabled="!isAllFilesSelected" v-model="aivmManifest.description" />
                    <v-select variant="solo-filled" class="mt-3" density="compact" hide-details
                        label="音声合成モデルのライセンス" :disabled="!isAllFilesSelected" v-model="selectedLicense"
                        :items="['ACML (Aivis Common Model License)', 'ACML-NC (Aivis Common Model License - Non Commercial)', 'パブリックドメイン (CC0)', 'カスタムライセンス', 'この音声合成モデルの公開・配布を行わない']" />
                    <div v-if="selectedLicense === 'ACML (Aivis Common Model License)'" class="mt-2" style="margin-left: 5px; border-left: 3px solid rgb(var(--v-theme-text-darken-2)); padding-left: 10px;
                        font-size: 11px; color: rgb(var(--v-theme-text-darken-2));">
                        <a class="link" href="https://github.com/Aivis-Project/ACML/blob/master/ACML-1.0.md" target="_blank">ACML (Aivis Common Model License) のライセンス文を確認する</a><br>
                        ACML / ACML-NC は、音声合成モデルの自由な利用を促進しながら、制作者と利用者の双方にとって安心して活用できる環境を実現することを目指して策定されたライセンスです。
                    </div>
                    <div v-else-if="selectedLicense === 'ACML-NC (Aivis Common Model License - Non Commercial)'" class="mt-2" style="margin-left: 5px; border-left: 3px solid rgb(var(--v-theme-text-darken-2)); padding-left: 10px;
                        font-size: 11px; color: rgb(var(--v-theme-text-darken-2));">
                        <a class="link" href="https://github.com/Aivis-Project/ACML/blob/master/ACML-NC-1.0.md" target="_blank">ACML-NC (Aivis Common Model License - Non Commercial) のライセンス文を確認する</a><br>
                        ACML / ACML-NC は、音声合成モデルの自由な利用を促進しながら、制作者と利用者の双方にとって安心して活用できる環境を実現することを目指して策定されたライセンスです。
                    </div>
                    <div v-else-if="selectedLicense === 'パブリックドメイン (CC0)'" class="mt-2" style="margin-left: 5px; border-left: 3px solid rgb(var(--v-theme-text-darken-2)); padding-left: 10px;
                        font-size: 11px; color: rgb(var(--v-theme-text-darken-2));">
                        <a class="link" href="https://creativecommons.org/publicdomain/zero/1.0/deed.ja" target="_blank">CC0 1.0 Universal のライセンス文を確認する</a><br>
                        ※ パブリックドメインとして宣言することは法的に難しい場合があるため、CC0 ライセンスを採用しています。
                    </div>
                    <v-textarea v-if="selectedLicense === 'カスタムライセンス'" variant="solo-filled" class="mt-3" density="compact" rows="8" hide-details
                        label="カスタムライセンスの内容を入力 (Markdown 形式またはプレーンテキスト)" :disabled="!isAllFilesSelected" v-model="aivmManifest.license" />
                </div>
                <div style="width: 360px; flex-shrink: 0;">
                    <v-text-field variant="solo-filled" density="compact" hide-details
                        :readonly="!developerMode"
                        label="AIVM マニフェストバージョン (読み取り専用)" :disabled="!isAllFilesSelected" v-model="aivmManifest.manifest_version" />
                    <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details readonly
                        label="音声合成モデルのアーキテクチャ (読み取り専用)" :disabled="!isAllFilesSelected" v-model="aivmManifest.model_architecture" />
                    <v-number-input variant="solo-filled" class="mt-3" density="compact" hide-details :min="1"
                        label="音声合成モデルのエポック数 (省略可)" :disabled="!isAllFilesSelected" v-model="aivmManifest.training_epochs" />
                    <v-number-input variant="solo-filled" class="mt-3" density="compact" hide-details :min="1"
                        label="音声合成モデルのステップ数 (省略可)" :disabled="!isAllFilesSelected" v-model="aivmManifest.training_steps" />
                    <v-text-field variant="solo-filled" class="mt-3" density="compact" hide-details
                        :readonly="!developerMode"
                        label="音声合成モデルの UUID (読み取り専用)" :disabled="!isAllFilesSelected" v-model="aivmManifest.uuid" />
                    <v-text-field variant="solo-filled" class="mt-3" density="compact"
                        :rules="[v => !!v || 'バージョンは必須です。', v => Utils.SEMVER_REGEX.test(v) || 'SemVer 2.0 形式のバージョンを入力してください。']"
                        label="音声合成モデルのバージョン" :disabled="!isAllFilesSelected" v-model="aivmManifest.version" />
                    <div style="margin-left: 5px; border-left: 3px solid rgb(var(--v-theme-text-darken-2)); padding-left: 10px;
                        font-size: 11px; color: rgb(var(--v-theme-text-darken-2));">
                        <strong>同じ音声合成モデルを更新する際は、バージョンを上げることを推奨します。</strong><a class="link" href="https://semver.org/lang/ja/" target="_blank">SemVer 2.0 形式のバージョン</a> を入力してください。
                    </div>
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
                                label="話者の名前 (最大 80 文字 / 単独話者モデルではモデル名と自動同期されます)" :disabled="!isAllFilesSelected" v-model="speaker.name"
                                :rules="[v => !!v || '話者の名前は必須です。']" />
                            <v-combobox variant="solo-filled" class="mt-3" density="compact" hide-details readonly multiple chips
                                label="話者の対応言語 (BCP 47 言語タグ / 読み取り専用)" :disabled="!isAllFilesSelected" v-model="speaker.supported_languages" />
                        </div>
                        <div style="width: 360px; flex-shrink: 0;">
                            <v-text-field variant="solo-filled" density="compact" hide-details
                                :readonly="!developerMode"
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
                                        label="スタイルの名前 (最大 20 文字)" :disabled="!isAllFilesSelected" v-model="style.name"
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
                                <div class="mt-3 aivm-voice-sample" v-for="(voiceSample, sampleIndex) in style.voice_samples" :key="sampleIndex">
                                    <div class="d-flex flex-column w-100" style="gap: 8px;">
                                        <div class="d-flex align-center" style="position: relative;">
                                            <v-overlay
                                                :model-value="voiceSampleEncodingStatus[getVoiceSampleKey(speaker.uuid, style.local_id, sampleIndex)] ?? false"
                                                contained
                                                class="align-center justify-center"
                                                persistent>
                                                <v-progress-circular color="primary" indeterminate size="36"></v-progress-circular>
                                            </v-overlay>
                                            <audio class="w-100" style="height: 36px;" controls :src="voiceSample.audio"></audio>
                                            <ActionButton icon="fluent:headphones-sound-wave-20-filled" class="ml-3" font_size="13.5px"
                                                :disabled="!isFFmpegLoaded || (voiceSampleEncodingStatus[getVoiceSampleKey(speaker.uuid, style.local_id, sampleIndex)] ?? false)"
                                                @click="selectAndEncodeVoiceSample(voiceSample, speaker.uuid, style.local_id, sampleIndex)">
                                                {{ isFFmpegLoaded ? 'ファイル選択' : '準備中...' }}
                                            </ActionButton>
                                        </div>
                                        <v-text-field variant="solo-filled" density="compact" hide-details
                                            label="ボイスサンプルの書き起こし文 (必須)" v-model="voiceSample.transcript"
                                            :rules="[v => !!v || '書き起こし文は必須です。']" />
                                    </div>
                                    <ActionButton icon="fluent:delete-16-filled" class="ml-3" font_size="13.5px"
                                        :disabled="(voiceSampleEncodingStatus[getVoiceSampleKey(speaker.uuid, style.local_id, sampleIndex)] ?? false)"
                                        @click="style.voice_samples.splice(sampleIndex, 1)">
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
                :model-value="JSON.stringify(currentAivmMetadata?.hyper_parameters, null, 4)" />
        </v-form>
        <Heading2 class="mt-6">3. AIVM / AIVMX ファイルを生成</Heading2>
        <Description class="mt-5 px-5 py-3" style="border-left: 4px solid rgb(var(--v-theme-primary)); background-color: rgb(var(--v-theme-background-darken-1));
            word-break: keep-all; overflow-wrap: anywhere;">
            <p class="mb-1"><strong>AivisSpeech での音声合成には AIVMX (.aivmx) 形式を、モデルミックスや開発には AIVM (.aivm) 形式をご利用ください。</strong></p>
            <ul class="ml-3">
                <li><strong>AIVM (.aivm)</strong>: モデルミックスによる新しい声質の作成やファインチューニングが可能な形式です。
                    <ul class="ml-5">
                        <li>おもに NVIDIA GPU での利用に特化しています。(PyTorch + Safetensors モデル)</li>
                    </ul>
                </li>
                <li><strong>AIVMX (.aivmx)</strong>: より多くの環境で音声合成を実行できる形式です。
                    <ul class="ml-5">
                        <li><strong>CPU だけでも快適に音声合成を実行できます。</strong>やろうと思えば Web ブラウザでも動かせます。(ONNX モデル)</li>
                        <li>Windows では AMD Radeon / Intel Arc GPU でも高速に動作します。</li>
                        <li><strong>AivisSpeech はインストールサイズを削減するため、AIVMX ファイルにのみ対応しています。</strong></li>
                    </ul>
                </li>
            </ul>
        </Description>
        <div class="mt-5 d-flex justify-center">
            <ActionButton secondary icon="fluent:save-20-filled" height="45px" font_size="14px"
                :disabled="!isAllFilesSelected" @click="downloadAivmFile">
                上記メタデータで AIVM / AIVMX ファイル (.aivm / .aivmx) を生成
            </ActionButton>
        </div>
    </main>
</template>
<script lang="ts" setup>

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import Aivmlib from 'aivmlib-web';
import { AivmMetadata, AivmManifest, DefaultAivmManifest, DEFAULT_ICON_DATA_URL } from 'aivmlib-web';
import { computed, onMounted, ref, watch, toRaw } from 'vue';
import { VForm } from 'vuetify/components';
import { VNumberInput } from 'vuetify/labs/components';

import ActionButton from '@/components/ActionButton.vue';
import Description from '@/components/Description.vue';
import Heading2 from '@/components/Heading2.vue';
import Heading3 from '@/components/Heading3.vue';
import { DEFAULT_VOICE_SAMPLE_DATA_URL } from '@/constants';
import { LICENSE_ACML, LICENSE_ACML_NC, LICENSE_CC0 } from '@/constants';
import Message from '@/message';
import Utils from '@/utils';

// Safari の場合は警告を表示
if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
    Message.warning('Safari では動作検証を行なっておらず、正常に動作しない可能性があります。\n最新版の Chrome をご利用ください。');
}
// Firefox の場合は警告を表示
if (navigator.userAgent.includes('Firefox')) {
    Message.warning('Firefox では動作検証を行なっておらず、正常に動作しない可能性があります。\n最新版の Chrome をご利用ください。');
}

// ONNX 変換対象のモデルファイル
const convertTargetModel = ref<File | File[] | undefined>(undefined);
const convertTargetHyperParameters = ref<File | File[] | undefined>(undefined);
const convertTargetStyleVectors = ref<File | File[] | undefined>(undefined);

// ONNX 変換を実行する関数
const convertModel = async () => {

    // ファイルが選択されていない場合は処理を中断
    if (!convertTargetModel.value) {
        Message.error('変換対象のモデルファイルを選択してください。');
        return;
    }
    if (!convertTargetHyperParameters.value || !convertTargetStyleVectors.value) {
        Message.error('ハイパーパラメータとスタイルベクトルを選択してください。');
        return;
    }
    // 現時点では未実装のため警告を表示
    Message.warning('ONNX 変換機能は現在実装中です。もうしばらくお待ちください。');
    return;

    // eslint-disable-next-line no-unreachable
    try {
        // FormData を作成
        const form_data = new FormData();
        form_data.append('model', convertTargetModel.value as File);
        form_data.append('hyper_parameters', convertTargetHyperParameters.value as File);
        form_data.append('style_vectors', convertTargetStyleVectors.value as File);

        // API にリクエストを送信
        // Note: API エンドポイントは仮のものです
        const response = await fetch('/api/convert-to-onnx', {
            method: 'POST',
            body: form_data,
        });
        if (!response.ok) {
            Message.error(`ONNX モデルへの変換に失敗しました。(HTTP Error ${response.status})`);
            return;
        }

        // レスポンスから Blob を取得
        const blob = await response.blob();

        // ダウンロードリンクを作成して自動ダウンロードを実行
        Utils.downloadBlobData(blob, (convertTargetModel.value as File).name.replace('.safetensors', '.onnx'));
        Message.success('ONNX モデルへの変換が完了しました。');
    } catch (error) {
        Message.error(`ONNX モデルへの変換に失敗しました。${(error as Error).message}`);
    }
};

// 1. ファイル選択 での状態
const selectionTypeTabIndex = ref(0);
const selectedArchitecture = ref<'Style-Bert-VITS2 (JP-Extra)' | 'Style-Bert-VITS2'>('Style-Bert-VITS2 (JP-Extra)');
const selectedSafetensorsModel = ref<File | File[] | undefined>(undefined);
const selectedOnnxModel = ref<File | File[] | undefined>(undefined);
const selectedHyperParameters = ref<File | File[] | undefined>(undefined);
const selectedStyleVectors = ref<File | File[] | undefined>(undefined);
const selectedAivm = ref<File | File[] | undefined>(undefined);
const selectedAivmx = ref<File | File[] | undefined>(undefined);

// 1. ファイル選択 で全てのファイルが選択されているかどうか
const isAllFilesSelected = computed(() => {
    // 「各ファイルから新規生成」の場合
    if (selectionTypeTabIndex.value === 0) {
        return selectedSafetensorsModel.value !== undefined && selectedOnnxModel.value !== undefined &&
            selectedHyperParameters.value !== undefined && selectedStyleVectors.value !== undefined;
    // 「既存の .aivm/.aivmx ファイルのメタデータを編集」の場合
    } else {
        return selectedAivm.value !== undefined && selectedAivmx.value !== undefined;
    }
});

// 1. ファイル選択 のいずれかの値が変更されたら、メタデータ編集の入力欄をリセット
// その際全てのファイルが選択されていれば、 AIVM メタデータの生成 or 再読み込みを実行する
watch([selectedArchitecture, selectedSafetensorsModel, selectedOnnxModel, selectedHyperParameters, selectedStyleVectors, selectedAivm, selectedAivmx], () => {
    currentAivmMetadata.value = null;
    speakerTabIndex.value = 0;

    // 全てのファイルが選択されている場合
    if (isAllFilesSelected.value) {
        if (selectionTypeTabIndex.value === 0) {
            // 「各ファイルから新規生成」の場合
            Aivmlib.generateAivmMetadata(
                selectedArchitecture.value,
                selectedHyperParameters.value as File,
                selectedStyleVectors.value as File | null,
            ).then((metadata) => {
                // モデルファイル名からエポック数とステップ数を抽出
                const modelFileName = (selectedSafetensorsModel.value as File).name;
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
                currentAivmMetadata.value = metadata;
            }).catch((error) => {
                Message.error(error.message);
                console.error(error);
            });
        } else {
            // 「既存の .aivm/.aivmx ファイルのメタデータを編集」の場合
            // AIVM と AIVMX の両方からメタデータを読み込み、一致することを確認
            Promise.all([
                Aivmlib.readAivmMetadata(selectedAivm.value as File),
                Aivmlib.readAivmxMetadata(selectedAivmx.value as File),
            ]).then(([AivmMetadataInAivm, AivmMetadataInAivmx]) => {
                console.log('AIVM metadata (in AIVM):', AivmMetadataInAivm);
                console.log('AIVM metadata (in AIVMX):', AivmMetadataInAivmx);
                // メタデータの一致を確認（UUID で比較）
                if (AivmMetadataInAivm.manifest.uuid !== AivmMetadataInAivmx.manifest.uuid) {
                    Message.error('選択された AIVM ファイルと AIVMX ファイルのメタデータ (UUID) が一致しません。');
                    console.error('選択された AIVM ファイルと AIVMX ファイルのメタデータ (UUID) が一致しません。');
                    return;
                }
                // AIVMX 側のメタデータを使う
                currentAivmMetadata.value = AivmMetadataInAivmx;
            }).catch((error) => {
                Message.error(error.message);
                console.error(error);
            });
        }
    }
});

// モデル差し替え用の状態
const enableModelReplacement = ref(false);
const replacementSafetensorsModel = ref<File | File[] | undefined>(undefined);
const replacementOnnxModel = ref<File | File[] | undefined>(undefined);
const replacementHyperParameters = ref<File | File[] | undefined>(undefined);
const replacementStyleVectors = ref<File | File[] | undefined>(undefined);
const modelReplacementWarnings = ref<string[]>([]);
const isModelReplacing = ref(false);

// モデル差し替え用ファイルが選択された時の処理
watch([replacementHyperParameters, replacementStyleVectors], async () => {
    // 既存の AIVM / AIVMX ファイルが選択されていて、かつ差し替えモードが有効で、必要なファイルが揃っている場合
    if (
        currentAivmMetadata.value &&
        enableModelReplacement.value &&
        replacementHyperParameters.value &&
        replacementStyleVectors.value &&
        !isModelReplacing.value
    ) {
        try {
            isModelReplacing.value = true;

            // 既存のメタデータを新しいハイパーパラメータとスタイルベクトルで更新
            const { updated_metadata, warnings } = await Aivmlib.updateAivmMetadata(
                // updateAivmMetadata() 内部で structuredClone() が使われている関係で、
                // Proxy に包まれたオブジェクトではなく、生のオブジェクトを明示的に渡す必要がある
                // ref: https://stackoverflow.com/questions/72632173/unable-to-use-structuredclone-on-value-of-ref-variable
                toRaw(currentAivmMetadata.value),
                replacementHyperParameters.value as File,
                replacementStyleVectors.value as File,
            );

            console.log('Model replacement process completed:', warnings);

            // 更新されたメタデータを反映
            currentAivmMetadata.value = updated_metadata;
            modelReplacementWarnings.value = warnings;

            // 警告があれば表示
            if (warnings.length > 0) {
                Message.warning(
                    `モデルの差し替えにより以下の変更が行われました:\n${warnings.join('\n')}`
                );
            } else {
                Message.success('モデルの差し替えが正常に反映されました。');
            }
        } catch (error) {
            console.error('Model replacement process failed:', error);
            Message.error(`モデル差し替え処理中にエラーが発生しました: ${(error as Error).message}`);
        } finally {
            isModelReplacing.value = false;
        }
    }
});

// 差し替えモードが切り替わった時の処理
watch(enableModelReplacement, (newValue) => {
    if (!newValue) {
        // 差し替えモードがオフになったら選択を解除
        replacementSafetensorsModel.value = undefined;
        replacementOnnxModel.value = undefined;
        replacementHyperParameters.value = undefined;
        replacementStyleVectors.value = undefined;
        modelReplacementWarnings.value = [];
    } else {
        // 差し替えモードがオンになったらガイダンスを表示
        Message.info('モデル差し替えモードを有効にしました。差し替えるファイルを選択してください。');
    }
});

// 2. メタデータ編集 での状態
const form = ref<VForm | null>(null);
const speakerTabIndex = ref(0);
const developerMode = ref(false);

// 2. メタデータ編集 でファイルから読み込んだ AIVM メタデータ
const currentAivmMetadata = ref<AivmMetadata | null>(null);

// 選択中の AIVM メタデータが変更された際に実行する処理
watch(currentAivmMetadata, async (newValue) => {
    if (newValue) {
        // ライセンスに応じて selectedLicense を設定
        if (newValue.manifest.license === LICENSE_ACML) {
            selectedLicense.value = 'ACML (Aivis Common Model License)';
        } else if (newValue.manifest.license === LICENSE_ACML_NC) {
            selectedLicense.value = 'ACML-NC (Aivis Common Model License - Non Commercial)';
        } else if (newValue.manifest.license === LICENSE_CC0) {
            selectedLicense.value = 'パブリックドメイン (CC0)';
        } else if (newValue.manifest.license === null) {
            selectedLicense.value = 'この音声合成モデルの公開・配布を行わない';
        } else {
            selectedLicense.value = 'カスタムライセンス';
        }

        // ffmpeg がロードされている場合、WAV 形式のボイスサンプルを検出して M4A に変換
        if (isFFmpegLoaded.value) {
            await detectAndConvertWavSamples();
        }
    }
}, { immediate: true });

// 編集中の AIVM マニフェスト (3. AIVM / AIVMX ファイルを生成 で書き込む元データとして用いる)
// AIVM メタデータが読み込まれていない場合はデフォルト値を返す
const aivmManifest = computed(() => {
    return currentAivmMetadata.value?.manifest ?? structuredClone(DefaultAivmManifest);
});

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
        const dataUrl = await Utils.blobToDataURL(croppedFile);
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

type License = (
    'ACML (Aivis Common Model License)' |
    'ACML-NC (Aivis Common Model License - Non Commercial)' |
    'パブリックドメイン (CC0)' |
    'この音声合成モデルの公開・配布を行わない' |
    'カスタムライセンス'
);

// ライセンスが変更された際の処理
const selectedLicense = ref<License>('ACML (Aivis Common Model License)');
watch(selectedLicense, (newValue) => {
    switch (newValue) {
        case 'ACML (Aivis Common Model License)':
            aivmManifest.value.license = LICENSE_ACML;
            break;
        case 'ACML-NC (Aivis Common Model License - Non Commercial)':
            aivmManifest.value.license = LICENSE_ACML_NC;
            break;
        case 'パブリックドメイン (CC0)':
            aivmManifest.value.license = LICENSE_CC0;
            break;
        case 'この音声合成モデルの公開・配布を行わない':
            aivmManifest.value.license = null;
            break;
        case 'カスタムライセンス':
            if (aivmManifest.value.license === null ||
                aivmManifest.value.license === LICENSE_ACML ||
                aivmManifest.value.license === LICENSE_ACML_NC ||
                aivmManifest.value.license === LICENSE_CC0) {
                // 未設定、もしくは定義済みライセンスの場合は空文字列にリセット
                aivmManifest.value.license = '';
            }
            break;
    }
});

// ffmpeg.wasm のインスタンスと状態
const ffmpegInstance = new FFmpeg();  // ref にすると動作しない
const isFFmpegLoaded = ref(false);
const voiceSampleEncodingStatus = ref<Record<string, boolean>>({});

// コンポーネントマウント時に ffmpeg をロード
onMounted(async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';  // Vite/ESM 環境に適したパス
    const ffmpeg = ffmpegInstance;
    ffmpeg.on('log', ({ message }) => {
        console.log(`[ffmpeg] ${message}`); // ffmpeg のログをコンソールに出力
    });
    try {
        console.log('Loading ffmpeg-core.js...');
        const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
        console.log('Loading ffmpeg-core.wasm...');
        const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
        await ffmpeg.load({ coreURL, wasmURL });
        isFFmpegLoaded.value = true;
        console.log('ffmpeg.wasm loaded successfully.');
    } catch (ex) {
        console.error('Failed to load ffmpeg.wasm:', ex);
        Message.error(`FFmpeg.wasm のロードに失敗しました。\n${(ex as Error).message}`);
    }
});

// ボイスサンプルの状態管理用のキーを生成するヘルパー関数
const getVoiceSampleKey = (speaker_uuid: string, style_local_id: number, sample_index: number): string => {
    return `${speaker_uuid}-${style_local_id}-${sample_index}`;
};

// WAV 形式のボイスサンプルを検出して随時 M4A に変換する関数
const detectAndConvertWavSamples = async () => {
    if (!aivmManifest.value) return;

    // WAV 形式のボイスサンプルを検索
    const wavSamples: {
        voiceSample: AivmManifest['speakers'][number]['styles'][number]['voice_samples'][number],
        speakerUuid: string,
        styleLocalId: number,
        sampleIndex: number
    }[] = [];

    // すべての話者、スタイル、ボイスサンプルをチェック
    aivmManifest.value.speakers.forEach(speaker => {
        speaker.styles.forEach(style => {
            style.voice_samples.forEach((voiceSample, sampleIndex) => {
                // Data URL から MIME タイプを抽出
                const mimeMatch = voiceSample.audio.match(/^data:(audio\/wav);base64,/);
                if (mimeMatch && mimeMatch[1] === 'audio/wav') {
                    wavSamples.push({
                        voiceSample,
                        speakerUuid: speaker.uuid,
                        styleLocalId: style.local_id,
                        sampleIndex
                    });
                }
            });
        });
    });

    // WAV 形式のボイスサンプルが見つかった場合
    if (wavSamples.length > 0) {
        Message.info(`WAV 形式のボイスサンプル (${wavSamples.length}個) を M4A (AAC) 形式に変換しています...`);

        // サイズ削減量の合計（バイト単位）
        let totalSizeReduction = 0;

        // 各 WAV サンプルを順番に M4A に変換
        for (const [index, sample] of wavSamples.entries()) {
            const sampleKey = getVoiceSampleKey(sample.speakerUuid, sample.styleLocalId, sample.sampleIndex);
            voiceSampleEncodingStatus.value = { ...voiceSampleEncodingStatus.value, [sampleKey]: true };

            try {
                // 変換前のサイズを記録
                const originalSize = sample.voiceSample.audio.length;

                // Data URL から Blob を作成
                const base64Data = sample.voiceSample.audio.replace(/^data:audio\/wav;base64,/, '');
                const binaryData = atob(base64Data);
                const arrayBuffer = new ArrayBuffer(binaryData.length);
                const uint8Array = new Uint8Array(arrayBuffer);

                for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i);
                }

                const wavBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
                const wavFile = new File([wavBlob], `sample_${index}.wav`, { type: 'audio/wav' });

                // 音声ファイルを M4A にエンコード
                const dataUrl = await Utils.encodeAudioToM4ADataURL(wavFile, ffmpegInstance, {
                    bitrate: '192k',
                });

                // 変換後のサイズを計算
                const newSize = dataUrl.length;

                // サイズ削減量を計算して合計に加算
                const sizeReduction = originalSize - newSize;
                totalSizeReduction += sizeReduction;

                // ボイスサンプルの音声データを更新
                sample.voiceSample.audio = dataUrl;
                console.log(`Converted WAV to M4A for sample: ${sampleKey} (${index + 1}/${wavSamples.length}), Size reduction: ${(sizeReduction / 1024 / 1024).toFixed(2)} MB`);
            } catch (ex) {
                console.error(`Failed to convert WAV to M4A for sample: ${sampleKey}`, ex);
            } finally {
                voiceSampleEncodingStatus.value = { ...voiceSampleEncodingStatus.value, [sampleKey]: false };
            }

            // UI の更新を待つ
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // MB 単位でサイズ削減量を表示（小数点以下2桁で四捨五入）
        const reductionInMB = (totalSizeReduction / 1024 / 1024).toFixed(2);

        Message.success(`${wavSamples.length}個のボイスサンプルを M4A (AAC) 形式に変換し、\n音声合成モデルのファイルサイズが合計 ${reductionInMB} MB 削減されました。`);
    }
};

// ボイスサンプルファイルを選択し、M4A にエンコードする関数
const selectAndEncodeVoiceSample = async (
    voiceSample: AivmManifest['speakers'][number]['styles'][number]['voice_samples'][number],
    speaker_uuid: string,
    style_local_id: number,
    sample_index: number,
) => {
    const sampleKey = getVoiceSampleKey(speaker_uuid, style_local_id, sample_index);

    // ファイル選択ダイアログを開く
    const file = await Utils.selectFile('audio/*');
    if (!file) return; // ファイルが選択されなかった場合は何もしない

    // エンコード状態を開始に設定
    voiceSampleEncodingStatus.value = { ...voiceSampleEncodingStatus.value, [sampleKey]: true };

    try {
        console.log(`Starting encoding for voice sample: ${sampleKey}`);

        // M4A にエンコード
        const dataUrl = await Utils.encodeAudioToM4ADataURL(file, ffmpegInstance, {
            bitrate: '192k',
        });

        // Data URL をボイスサンプルに設定
        voiceSample.audio = dataUrl;
        console.log(`Set encoded audio for sample: ${sampleKey}`);
        Message.success('ボイスサンプルを M4A (AAC) 形式に変換しました。');

    } catch (ex) {
        console.error('Failed to encode voice sample:', ex);
        Message.error(`ボイスサンプルの M4A (AAC) 形式への変換に失敗しました。\n${(ex as Error).message}`);
    } finally {
        // エンコード状態を終了に設定
        voiceSampleEncodingStatus.value = { ...voiceSampleEncodingStatus.value, [sampleKey]: false };
        console.log(`Encoding process finished for sample: ${sampleKey}`);
    }
};

// 3. AIVM / AIVMX ファイルを生成 での処理
async function downloadAivmFile() {
    if (currentAivmMetadata.value === null) {
        Message.error('AIVM メタデータが読み込まれていません。');
        return;
    }

    // バリデーションを実行
    if ((await form.value!.validate()).valid === false) {
        Message.error('入力内容にエラーがあります。');
        return;
    }

    // モデルファイルの決定
    // - 差し替えモードの場合：差し替え用のモデルファイルを使用
    // - 「各ファイルから新規生成」の場合：選択された Safetensors / ONNX ファイルを使用
    // - 「既存の .aivm/.aivmx ファイルのメタデータを編集」かつ差し替えなしの場合：選択された AIVM / AIVMX ファイルを使用
    let safetensorsFile: File;
    let onnxFile: File;

    if (enableModelReplacement.value && replacementSafetensorsModel.value && replacementOnnxModel.value) {
        // 差し替えモードの場合
        safetensorsFile = replacementSafetensorsModel.value as File;
        onnxFile = replacementOnnxModel.value as File;
    } else if (selectionTypeTabIndex.value === 0) {
        // 「各ファイルから新規生成」の場合
        safetensorsFile = selectedSafetensorsModel.value as File;
        onnxFile = selectedOnnxModel.value as File;
    } else {
        // 「既存の .aivm/.aivmx ファイルのメタデータを編集」かつ差し替えなしの場合
        safetensorsFile = selectedAivm.value as File;
        onnxFile = selectedAivmx.value as File;
    }

    // AIVM と AIVMX の両方を生成
    Promise.all([
        Aivmlib.writeAivmMetadata(safetensorsFile, currentAivmMetadata.value),
        Aivmlib.writeAivmxMetadata(onnxFile, currentAivmMetadata.value),
    ]).then(([aivmBlob, aivmxBlob]) => {
        console.log('Generated AIVM metadata:', currentAivmMetadata.value);
        // モデル名をファイル名として両方をダウンロード
        Utils.downloadBlobData(aivmBlob, `${aivmManifest.value.name}.aivm`);
        Utils.downloadBlobData(aivmxBlob, `${aivmManifest.value.name}.aivmx`);
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

// 開発者モード用隠しチェックボックスのスタイル
.developer-mode-checkbox.v-checkbox {
    cursor: pointer;
    user-select: none;
    transition: opacity 0.3s;
    opacity: 0;
    &:hover {
        opacity: 0.2 !important;
    }
}

</style>