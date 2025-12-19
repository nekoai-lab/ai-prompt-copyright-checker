# 🐱 月ねこAI - プロンプト著作権チェッカー

<p align="center">
  <img src="public/tsukinek.png" alt="月ねこAI" width="120" />
</p>

<p align="center">
  <strong>AI画像生成のプロンプトを安心・安全に！</strong><br>
  著作権リスクをAIがチェックして、安全な代替プロンプトを提案します
</p>

---

## ✨ こんな悩みを解決します

- 🤔 「このキャラクター名、使っていいのかな...？」
- 😰 「著作権侵害になったらどうしよう」
- 🎨 「○○風って書いたけど、大丈夫？」

**月ねこAI**が、あなたのプロンプトをチェックして、安全に画像生成を楽しめるようサポートします！

---

## 🚀 特徴

| 機能 | 説明 |
|------|------|
| 🔍 **リアルタイム判定** | AIがプロンプトを即座に分析し、著作権リスクを検出 |
| 📊 **リスクスコア表示** | High / Medium / Low の3段階で分かりやすく表示 |
| ✏️ **安全な代替案を提案** | リスクのある表現を、安全な表現に自動変換 |
| 📋 **ワンクリックコピー** | 安全なプロンプトをすぐにコピーして使える |
| 🇯🇵 **日本語対応** | 自然な日本語でプロンプトを再構成 |

---

## 📖 使い方

1. **プロンプトを入力** - チェックしたいプロンプトを入力欄に貼り付け
2. **判定ボタンをクリック** - AIがリスクを分析
3. **結果を確認** - リスクスコアと検出された問題を確認
4. **安全なプロンプトをコピー** - 提案された安全なプロンプトを使用

---

## 🛠️ セットアップ

### 必要なもの

- Node.js 18以上
- Google Gemini API キー または OpenAI API キー

### インストール手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/nekoai-lab/ai-prompt-copyright-checker.git
cd ai-prompt-copyright-checker

# 2. 依存関係をインストール
npm install

# 3. 環境変数を設定
cp .env.example .env
# .envファイルを編集してAPIキーを設定

# 4. 開発サーバーを起動
npm run dev
```

### 環境変数の設定

`.env`ファイルを作成し、以下を設定してください：

```env
# 使用するLLMプロバイダー（gemini または openai）
VITE_LLM_PROVIDER=gemini

# Google Gemini API Key（推奨）
VITE_GEMINI_API_KEY=your_api_key_here

# または OpenAI API Key
VITE_OPENAI_API_KEY=your_api_key_here
```

<details>
<summary>📌 APIキーの取得方法</summary>

### Google Gemini API（推奨・無料枠あり）

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. 生成されたキーを`.env`ファイルに設定

### OpenAI API

1. [OpenAI Platform](https://platform.openai.com/api-keys) にアクセス
2. アカウントを作成またはログイン
3. 「Create new secret key」をクリック
4. 生成されたキーを`.env`ファイルに設定

</details>

---

## 🔧 開発者向け情報

### 技術スタック

- React 18 + Vite
- TypeScript
- Tailwind CSS
- Shadcn UI / Radix UI
- Lucide React
- Google Gemini API / OpenAI API

### コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run preview  # ビルドプレビュー
npm run lint     # ESLint実行
```

### プロジェクト構造

```
src/
├── App.tsx            # メインアプリ
├── logic.ts           # API呼び出し・判定ロジック
├── types.ts           # 型定義
├── components/
│   ├── ResultView.tsx # 結果表示コンポーネント
│   └── ui/            # UIコンポーネント
└── lib/
    └── utils.ts       # ユーティリティ
```

---

## 📝 注意事項

- このツールは著作権リスクの判定を支援するものであり、法的なアドバイスではありません
- 最終的な判断はご自身の責任で行ってください
- APIの使用には料金が発生する場合があります（Gemini APIは無料枠あり）

---

## 📄 ライセンス

MIT License

---

<p align="center">
  Made with 💜 by nekoai-lab
</p>
