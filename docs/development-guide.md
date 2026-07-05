# 開発・ビルド手順

## 前提

- Node.js と npm が使える環境で実行する。
- このプロジェクトは Vite + React + TypeScript で作られている。
- ビルド成果物は `dist/` に出力される。
- `dist/` は `.gitignore` に含まれているため、Git の追跡対象外。

## 初回セットアップ

依存パッケージをインストールする。

```bash
npm install
```

## ローカル開発サーバーの起動

開発用サーバーを起動する。

```bash
npm run dev
```

起動後、ターミナルに表示される URL をブラウザで開く。
通常は以下で確認できる。

```txt
http://localhost:5173/
```

Codex 環境などでホストを明示したい場合は以下を使う。

```bash
npm run dev -- --host 127.0.0.1
```

この場合は以下で確認できる。

```txt
http://127.0.0.1:5173/
```

## 本番ビルド

TypeScript の型チェックと Vite の本番ビルドを実行する。

```bash
npm run build
```

成功すると `dist/` に本番用ファイルが生成される。

主な出力例:

```txt
dist/index.html
dist/assets/*.css
dist/assets/*.js
```

このプロジェクトは `vite.config.ts` で `base: "./"` を設定しているため、簡易確認だけなら以下のファイルを直接開ける。

```txt
dist/index.html
```

さらに `npm run build` の後処理で CSS と JS を `dist/index.html` に埋め込んでいるため、`dist/index.html` 単体を直接開いて確認できる。外部の `assets/*.js` を読み込まないので、ファイルを直接開いたときの空白画面を避けやすい。

## ビルド成果物の確認

ビルド後の成果物を本番に近い形で確認する場合は、Vite の preview を使う。

```bash
npm run preview
```

表示された URL をブラウザで開く。

## Git 追跡対象について

`dist/` はビルド生成物なので Git には含めない。

`.gitignore` で以下を除外している。

```gitignore
node_modules/
dist/
.DS_Store
```

ソースとして管理する主なファイルは以下。

```txt
src/
docs/
package.json
package-lock.json
index.html
vite.config.ts
tailwind.config.js
postcss.config.js
tsconfig*.json
```

## よく使うコマンド

```bash
npm install
npm run dev
npm run build
npm run preview
```
