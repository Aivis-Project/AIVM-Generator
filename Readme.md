
# AIVM Generator

💠 **AIVM Generator**: **Ai**vis **V**oice **M**odel File (.aivm/.aivmx) Utility **Generator** / Editor

-----

**AIVM** (**Ai**vis **V**oice **M**odel) / **AIVMX** (**Ai**vis **V**oice **M**odel for ONN**X**) は、**学習済みモデル・ハイパーパラメータ・スタイルベクトル・話者メタデータ（名前・概要・ライセンス・アイコン・ボイスサンプル など）を 1 つのファイルにギュッとまとめた、AI 音声合成モデル用オープンファイルフォーマット**です。

> [!NOTE]  
> **「AIVM」は、AIVM / AIVMX 両方のフォーマット仕様・メタデータ仕様の総称でもあります。**  
> 具体的には、AIVM ファイルは「AIVM メタデータを追加した Safetensors 形式」、AIVMX ファイルは「AIVM メタデータを追加した ONNX 形式」のモデルファイルです。  
> 「AIVM メタデータ」とは、AIVM 仕様に定義されている、学習済みモデルに紐づく各種メタデータのことをいいます。

[AivisSpeech](https://github.com/Aivis-Project/AivisSpeech) / [AivisSpeech-Engine](https://github.com/Aivis-Project/AivisSpeech-Engine) をはじめとした AIVM 仕様に対応するソフトウェアに AIVM / AIVMX ファイルを追加することで、AI 音声合成モデルを簡単に利用できます。

**この [AIVM Generator](https://aivm-generator.aivis-project.com/) では、ブラウザ上の GUI でかんたんに AIVM / AIVMX ファイルを生成・編集できます。**  
手動で AIVM / AIVMX ファイルを生成・編集する際は AIVM Generator の利用をおすすめします。

AIVM Generator で実装されている AIVM 仕様については [AIVM Specification](https://github.com/Aivis-Project/aivmlib#aivm-specification) をご覧ください。

> [!TIP]  
> **[aivmlib](https://github.com/Aivis-Project/aivmlib) / [aivmlib-web](https://github.com/Aivis-Project/aivmlib-web) では、AIVM / AIVMX ファイル内のメタデータを読み書きするためのユーティリティを提供します。**  
> aivmlib は、Python で書かれた AIVM 仕様のリファレンス実装です。  
> aivmlib-web は、Python で書かれた aivmlib をブラウザ上で利用できるよう TypeScript に移植したライブラリです。

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn dev
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

## License

[MIT License](License.txt)
