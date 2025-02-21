# next-bi-practices

BIツールを想定した課題の初期設定を行なった配布用のリポジトリです。ソース一式をダウンロードして、各々でリポジトリを作成のうえ、制作してください。

## Getting Started

### Prerequisites / 必要条件

```bash
nodejs v20.14.0
pnpm v9.4.0
```

### Installing / インストール

```bash
git@github.com:blc-ktn/next-bi-practices.git
cd next-bi-practices
pnpm i
```

## Starting the development. / 開発スタート

```Bash
pnpm dev:mock
```

## 注意事項

このプロジェクトでは`pnpm`を使用しています。

他パッケージマネージャーを使用する場合、`pnpm-lock.yaml`を削除して、動作確認のうえ、制作してください。

## 備考

「API仕様書」は、VS Code の拡張機能「[OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi)」をインストールのうえ、`docs/openapi.yaml`を開き、下記のリンク等を参考に閲覧してください。
- [Visual Studio CodeでOpenAPI(Swagger) Editorを使用する](https://qiita.com/YoshijiGates/items/413be433c0ba33e8ef3a)
- [OpenAPI・Swaggerでインタラクティブな API 仕様ドキュメントを作成する](https://zenn.dev/knm/articles/32106f623bd382)

「Linter, Formatter」は「[Biome](https://biomejs.dev/ja/)」を使用しています。ローカル環境でリアルタイムに実行させる場合は、VS Code の拡張機能「[Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)」をインストールしてください。

# next-bi-practices
