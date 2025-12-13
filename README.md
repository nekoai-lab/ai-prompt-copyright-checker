# AI画像生成プロンプト著作権チェッカー

AI画像生成プロンプトに含まれる著作権侵害リスクを検出し、安全な代替プロンプトを提案するMVPアプリケーションです。
LLM API（Google Gemini または OpenAI）を使用してリアルタイムに著作権リスクを判定します。

## 技術スタック

- **React 18+** (Vite)
- **TypeScript** (Strict mode)
- **Tailwind CSS** (Utility-first)
- **Lucide React** (Icons)
- **LLM API** (Google Gemini / OpenAI)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、APIキーを設定してください。

```bash
# .envファイルを作成
cp .env.example .env
```

`.env`ファイルを編集：

```env
# LLM Provider: 'gemini' または 'openai'
VITE_LLM_PROVIDER=gemini

# Google Gemini API Key
# 取得方法: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Key
# 取得方法: https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

### 4. ビルド

```bash
npm run build
```

### 5. プレビュー

```bash
npm run preview
```

## プロジェクト構造

```
src/
├── types.ts           # Type definitions
├── logic.ts           # LLM API呼び出しと検出エンジン
├── components/
│   └── ResultView.tsx # Hybrid UI component
└── App.tsx            # Main entry
```

## 機能

- **リアルタイム著作権リスク判定**: LLM API（Gemini 2.5 Flash）を使用して、あらゆるキャラクターや商標を検出
- **プロンプト入力とリスク判定**: ユーザーが入力したプロンプトを即座に分析
- **リスクスコアの可視化**: High/Medium/Lowの3段階でリスクレベルを表示
- **Before/After比較表示**: 元のプロンプトと安全な代替プロンプトを並べて表示
- **自然な日本語での安全なプロンプト生成**: LLMが元のプロンプト全体を自然な日本語で再構成
- **検出されたリスクの詳細表示**: 権利者情報やリスクの説明を表示
- **安全なプロンプトのコピー機能**: ワンクリックで安全なプロンプトをコピー

## APIキーの取得方法

### Google Gemini API

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたAPIキーを`.env`ファイルの`VITE_GEMINI_API_KEY`に設定

### OpenAI API

1. [OpenAI Platform](https://platform.openai.com/api-keys) にアクセス
2. アカウントを作成またはログイン
3. 「Create new secret key」をクリック
4. 生成されたAPIキーを`.env`ファイルの`VITE_OPENAI_API_KEY`に設定

**注意**: APIキーは環境変数で管理し、Gitにコミットしないでください。

## ライセンス

MIT

