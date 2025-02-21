# next-bi-practices

BIツールを想定した課題の初期設定を行なった配布用のリポジトリです。実プロジェクトを個人開発向けに最適化して実装しています。

## プロジェクト概要

このプロジェクトは、ユーザー管理とタスク管理機能を備えたBIツールのプロトタイプです。管理者画面とユーザー画面の2つのインターフェースを提供し、ユーザーの稼働率や案件の進捗状況を可視化します。

### 実プロジェクトとの違い

このリポジトリは学習用に簡略化されていますが、実プロジェクトでは以下の機能が追加実装されています：

- **データベース連携**: Supabaseを使用したリレーショナルデータベース
- **ページネーション**: 一覧リストの効率的な表示制御
- **その他の機能**: 実務を想定した追加機能

## 使用技術

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: CSS Modules
- **状態管理**: Context API
- **テスト**: Vitest
- **モック**: MSW (Mock Service Worker)
- **API仕様**: OpenAPI (Swagger)
- **Linter/Formatter**: Biome
- **パッケージマネージャー**: pnpm

## 必要条件

- Node.js v20.14.0
- pnpm v9.4.0

## 環境構築

1. リポジトリのクローン:

```bash
git clone git@github.com:blc-ktn/next-bi-practices.git
cd next-bi-practices
```

2. 依存関係のインストール:

```bash
pnpm install
```

3. 環境変数の設定:

```bash
cp .env.example .env.local
```

## 利用可能なコマンド

```bash
# 開発サーバーの起動（モックAPI使用）
pnpm dev:mock

# テストの実行
pnpm test

# Lintの実行
pnpm lint

# ビルド
pnpm build

# 本番モードでの起動
pnpm start
```

## ディレクトリ構成

```
.
├── src/
│   ├── app/           # ページコンポーネント
│   ├── components/    # 共通コンポーネント
│   ├── contexts/      # Contextの定義
│   ├── hooks/         # カスタムフック
│   ├── lib/          # ユーティリティ関数
│   ├── mocks/        # モックサーバー設定
│   └── types/        # 型定義
├── docs/             # API仕様書
├── public/           # 静的ファイル
└── tests/            # テストファイル
```

## API仕様書の閲覧方法

VS Codeの拡張機能「[OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi)」をインストールし、`docs/openapi.yaml`を開いてください。

参考リンク:
- [Visual Studio CodeでOpenAPI(Swagger) Editorを使用する](https://qiita.com/YoshijiGates/items/413be433c0ba33e8ef3a)
- [OpenAPI・Swaggerでインタラクティブな API 仕様ドキュメントを作成する](https://zenn.dev/knm/articles/32106f623bd382)

## コード品質

このプロジェクトでは[Biome](https://biomejs.dev/ja/)をLinter/Formatterとして使用しています。VS Codeで開発する場合は、拡張機能「[Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)」のインストールを推奨します。

## 開発のポイント

- **型安全性**: TypeScriptを活用した堅牢な型システム
- **コンポーネント設計**: 再利用可能なコンポーネントの実装
- **状態管理**: Context APIを使用した効率的な状態管理
- **テスト**: Vitestによる単体テストの実装
- **API連携**: MSWを使用したモックAPIの実装

## トラブルシューティング

### よくある問題と解決方法

1. **開発サーバーが起動しない場合**
   - Node.jsのバージョンが正しいか確認
   - `pnpm install`を再実行
   - `.env.local`ファイルが正しく設定されているか確認

2. **モックAPIが動作しない場合**
   - `NEXT_PUBLIC_API_MOCKING=enabled`が環境変数に設定されているか確認
   - ブラウザのコンソールでエラーメッセージを確認

3. **テストが失敗する場合**
   - `pnpm test --update`でスナップショットを更新
   - 必要なモックが正しく設定されているか確認

## 注意事項

このプロジェクトでは`pnpm`を使用しています。他のパッケージマネージャーを使用する場合は、`pnpm-lock.yaml`を削除し、動作確認のうえ制作してください。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
