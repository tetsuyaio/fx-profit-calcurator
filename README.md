# FX Pip Profit Calculator

通貨ペアとLot数から、指定したpips幅の損益を計算するブラウザアプリです。
1 / 10 / 50 / 100 pipsの損益を、損益通貨・口座通貨・日本円の3種類でまとめて確認できます。

為替レートの自動取得やバックエンド通信は行わず、入力から計算、設定保存までをブラウザ内で完結させています。

## 主な機能

- 14種類の通貨ペアに対応
- 1 / 10 / 50 / 100 pipsごとの損益を一覧表示
- 口座通貨としてUSDまたはJPYを選択可能
- クロス円以外の損益をJPYへ換算
- Lot、取引単位、換算レートの入力検証
- `decimal.js`を使った小数計算
- 入力内容を`localStorage`へ自動保存・復元
- ビルド後の`dist/index.html`を単体で表示可能

## 対応通貨ペア

| 種別 | 通貨ペア |
| --- | --- |
| クロス円 | USD/JPY、EUR/JPY、GBP/JPY、AUD/JPY、NZD/JPY、CAD/JPY、CHF/JPY |
| ドルストレート | EUR/USD、GBP/USD、AUD/USD、NZD/USD |
| その他 | USD/CAD、USD/CHF、EUR/GBP |

JPYを決済通貨とする通貨ペアでは1 pipを`0.01`、それ以外では`0.0001`として計算します。

## 使い方

1. 通貨ペアを選択します。
2. Lot数と取引単位（Contract Size）を入力します。
3. 口座通貨をUSDまたはJPYから選択します。
4. 表示された換算レートを現在のレートに更新します。
5. 計算結果で、各pips幅の損益を確認します。

入力内容を変更すると結果は即座に再計算されます。入力値は同じブラウザの`localStorage`に保存され、次回アクセス時に復元されます。

> [!IMPORTANT]
> 初期表示の換算レートはサンプル値です。実際の取引判断に利用する場合は、必ず最新のレートを入力してください。

### 換算レートについて

通貨ペアと口座通貨に応じて、計算に必要なレート欄だけが表示されます。

- USD建ての損益をJPYへ換算する場合: USD/JPY
- GBP建ての損益をJPYへ換算する場合: GBP/JPY
- CAD建ての場合: CAD/JPYを優先し、未入力ならUSD/JPY ÷ USD/CADを使用
- CHF建ての場合: CHF/JPYを優先し、未入力ならUSD/JPY ÷ USD/CHFを使用
- JPYまたはJPY換算値をUSD口座へ換算する場合: USD/JPY

## 計算方法

1 pipあたりの損益通貨での金額は、次の式で求めます。

```text
1 pipの損益 = Lot × 取引単位 × pipサイズ
```

たとえば、USD/JPY、0.01 Lot、取引単位100,000の場合は次のとおりです。

```text
0.01 × 100,000 × 0.01 = 10 JPY / pip
```

金額計算にはJavaScript標準の浮動小数点演算を直接使わず、`decimal.js`を使用しています。ただし、表示結果は参考値であり、ブローカーごとの契約仕様、手数料、スプレッド、スワップなどは含みません。

## セットアップ

### 必要な環境

- Node.js
- npm
- 最新版のChromeまたはEdgeを推奨

Node.jsのバージョンは現在固定していません。

### インストール

```bash
git clone <repository-url>
cd fx-profit-calcurator
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ターミナルに表示されたURLをブラウザで開きます。通常は`http://localhost:5173/`です。

### 本番ビルド

```bash
npm run build
```

TypeScriptの型チェック後にViteでビルドし、成果物を`dist/`へ出力します。さらにCSSとJavaScriptを`dist/index.html`へ埋め込むため、このHTMLファイルだけを直接開いて利用できます。

### ビルド結果の確認

```bash
npm run preview
```

## npm scripts

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | Vite開発サーバーを起動 |
| `npm run build` | 型チェック、本番ビルド、CSS/JSのインライン化を実行 |
| `npm run preview` | ビルド済みアプリをローカルで確認 |

現時点では、テストとLintのスクリプトは用意していません。

## 技術スタック

- React 19
- TypeScript
- Vite
- Tailwind CSS 3
- decimal.js
- Web Storage API（`localStorage`）

## ディレクトリ構成

```text
.
├── docs/                         # 詳細仕様、開発手順、実装決定記録
├── scripts/
│   └── inline-dist-assets.mjs    # ビルド成果物を単一HTML化
├── src/
│   ├── components/               # 入力欄、結果表などのUI
│   ├── constants/                # 通貨ペア、pip幅の定義
│   ├── lib/                      # 計算、換算、検証、保存処理
│   ├── types/                    # アプリ共通の型定義
│   ├── App.tsx                   # 状態管理と画面構成
│   └── main.tsx                  # エントリーポイント
├── index.html
├── package.json
└── vite.config.ts
```

金額計算は`src/lib/calculator.ts`に集約し、UIコンポーネントから分離しています。

## データとプライバシー

- 入力値は利用中のブラウザの`localStorage`にだけ保存されます。
- 外部APIへの送信や為替レートの自動取得は行いません。
- 保存内容を消す場合は、ブラウザのサイトデータから`fx-pip-calculator-settings`を削除してください。

## 現在の制約

- 為替レートは手動入力です。
- 対応する口座通貨はUSDとJPYのみです。
- スプレッド、手数料、スワップは計算に含みません。
- 貴金属、暗号資産、CFDには対応していません。
- ブローカー固有のpip定義や取引単位は自動判定しません。
- PCブラウザでの利用を主な対象としています。

## 関連ドキュメント

- [詳細仕様](docs/FX_Pip_Profit_Calculator_Codex_Detailed_Spec.md)
- [開発・ビルド手順](docs/development-guide.md)
- [実装決定記録](docs/implementation-decisions.md)

## 免責事項

このアプリの計算結果は参考情報です。実際の損益は、利用するブローカーの契約仕様や約定条件によって異なる場合があります。投資判断はご自身の責任で行ってください。
