# FX Pip Profit Calculator - Codex実装用 詳細仕様書

## 0. この仕様書の目的

このドキュメントは、Codex / Claude Code などのAIコーディングエージェントが、できるだけ一撃で実装できるようにするための詳細仕様書である。

対象は、FXの通貨ペアとLot数を入力し、1pip / 10pip / 50pip / 100pip あたりの損益を、損益通貨・口座通貨・JPY換算で表示するReactアプリ。

---

## 1. アプリ概要

### 1.1 アプリ名

```txt
FX Pip Profit Calculator
```

### 1.2 目的

ユーザーがFX取引前に、指定Lotに対するpip損益を即座に確認できるようにする。

特に以下を重視する。

- USD口座でもJPY換算で損益を把握できる
- クロス円以外の通貨ペアにも対応する
- 計算誤差を避けるためdecimal.jsを使う
- PCブラウザで見やすく使える
- 将来的にリスク管理ツールへ拡張しやすい構成にする

### 1.3 対象ユーザー

- 個人利用
- PCブラウザで利用
- スマホ対応は不要
- バックエンド不要
- ログイン不要

---

## 2. 技術スタック

必須：

```txt
Vite
React
TypeScript
Tailwind CSS
decimal.js
localStorage
```

### 2.1 制約

- Next.jsは使わない
- バックエンドは作らない
- API連携は初期実装しない
- PWA対応しない
- デスクトップアプリ化しない
- JavaScriptのnumberで直接計算しない
- 金額計算は必ずdecimal.jsを使う

---

## 3. 初期リリース範囲

初期実装で必ず作る機能：

- 通貨ペア選択
- Lot入力
- 口座通貨選択
- Contract Size入力
- 必要な換算レート入力
- 1 / 10 / 50 / 100 pip の損益表示
- 損益通貨での損益表示
- 口座通貨での損益表示
- JPY換算表示
- localStorage保存・復元
- 入力バリデーション
- 基本的なエラー表示

初期実装しない機能：

- 為替レートAPI自動取得
- SL幅からLot逆算
- リスク率計算
- リスクリワード計算
- スプレッド込み計算
- XAUUSD対応
- BTCUSD対応
- MT5 CSVインポート
- トレード日誌
- 月次損益集計

---

## 4. 対応環境

```txt
PCブラウザ
Chrome / Edge 最新版
```

スマホ表示は考慮しなくてよい。

ただし、極端に崩れない程度のレスポンシブはTailwindの標準的な実装でよい。

---

## 5. 画面仕様

### 5.1 画面全体

1画面完結。

構成：

```txt
┌────────────────────────────────────────────┐
│ FX Pip Profit Calculator                   │
│ 通貨ペアとLotからpip損益を計算します       │
├────────────────────────────────────────────┤
│ 入力エリア                                  │
│ - 通貨ペア                                  │
│ - Lot                                       │
│ - 口座通貨                                  │
│ - Contract Size                             │
│ - 換算レート                                │
├────────────────────────────────────────────┤
│ 結果テーブル                                │
│ 1 / 10 / 50 / 100 pip                       │
├────────────────────────────────────────────┤
│ 補足情報                                    │
│ - quote currency                            │
│ - pip size                                  │
│ - 使用した換算レート                         │
└────────────────────────────────────────────┘
```

### 5.2 レイアウト方針

PC前提なので、横幅を活かす。

推奨：

```txt
max-w-5xl
mx-auto
p-6
```

入力カードと結果カードを分ける。

---

## 6. 入力仕様

### 6.1 通貨ペア

selectで選択。

初期値：

```txt
USDJPY
```

初期対応ペア：

```txt
USDJPY
EURJPY
GBPJPY
AUDJPY
NZDJPY
CADJPY
CHFJPY
EURUSD
GBPUSD
AUDUSD
NZDUSD
USDCAD
USDCHF
EURGBP
```

### 6.2 Lot

input type text または number。

推奨は text として受け、decimal.jsで検証する。

初期値：

```txt
0.01
```

許可：

```txt
0.01
0.02
0.1
1
1.0
```

不許可：

```txt
0
-1
abc
空欄
```

### 6.3 口座通貨

selectで選択。

対応：

```txt
JPY
USD
```

初期値：

```txt
USD
```

理由：ユーザーはUSD口座を使っているため。

### 6.4 Contract Size

input。

初期値：

```txt
100000
```

通常FX：

```txt
1 lot = 100,000通貨
```

将来のブローカー差分に備えて変更可能にする。

不許可：

```txt
0
負数
文字列
空欄
```

### 6.5 換算レート

通貨ペアに応じて必要な入力欄だけ表示する。

初期値は空欄でもよいが、使いやすさのため以下のような仮値を入れてもよい。

```txt
USDJPY = 145
GBPJPY = 185
CADJPY = 107
CHFJPY = 165
USDCAD = 1.35
USDCHF = 0.88
```

ただし、仮値であることをUIで明記する必要はない。

localStorageに保存された値があればそれを優先する。

---

## 7. 通貨ペア定義

### 7.1 型

```ts
export type CurrencyCode =
  | "JPY"
  | "USD"
  | "EUR"
  | "GBP"
  | "AUD"
  | "NZD"
  | "CAD"
  | "CHF";

export type AccountCurrency = "JPY" | "USD";

export type CurrencyPairSymbol =
  | "USDJPY"
  | "EURJPY"
  | "GBPJPY"
  | "AUDJPY"
  | "NZDJPY"
  | "CADJPY"
  | "CHFJPY"
  | "EURUSD"
  | "GBPUSD"
  | "AUDUSD"
  | "NZDUSD"
  | "USDCAD"
  | "USDCHF"
  | "EURGBP";
```

### 7.2 定義データ

```ts
export interface CurrencyPairDefinition {
  symbol: CurrencyPairSymbol;
  base: CurrencyCode;
  quote: CurrencyCode;
  pipSize: string;
  label: string;
}
```

例：

```ts
{
  symbol: "EURUSD",
  base: "EUR",
  quote: "USD",
  pipSize: "0.0001",
  label: "EUR/USD",
}
```

### 7.3 全ペア定義

```txt
USDJPY base=USD quote=JPY pipSize=0.01
EURJPY base=EUR quote=JPY pipSize=0.01
GBPJPY base=GBP quote=JPY pipSize=0.01
AUDJPY base=AUD quote=JPY pipSize=0.01
NZDJPY base=NZD quote=JPY pipSize=0.01
CADJPY base=CAD quote=JPY pipSize=0.01
CHFJPY base=CHF quote=JPY pipSize=0.01

EURUSD base=EUR quote=USD pipSize=0.0001
GBPUSD base=GBP quote=USD pipSize=0.0001
AUDUSD base=AUD quote=USD pipSize=0.0001
NZDUSD base=NZD quote=USD pipSize=0.0001

USDCAD base=USD quote=CAD pipSize=0.0001
USDCHF base=USD quote=CHF pipSize=0.0001
EURGBP base=EUR quote=GBP pipSize=0.0001
```

---

## 8. 計算仕様

### 8.1 基本概念

FXの損益は原則として決済通貨（quote currency）で発生する。

例：

```txt
EURUSD
base = EUR
quote = USD
損益通貨 = USD
```

```txt
USDJPY
base = USD
quote = JPY
損益通貨 = JPY
```

### 8.2 pip価値

```txt
pipValueInQuote = lot × contractSize × pipSize
```

例：

```txt
USDJPY
lot = 0.01
contractSize = 100000
pipSize = 0.01

pipValue = 0.01 × 100000 × 0.01 = 10 JPY
```

```txt
EURUSD
lot = 0.01
contractSize = 100000
pipSize = 0.0001

pipValue = 0.01 × 100000 × 0.0001 = 0.1 USD
```

### 8.3 指定pipsの損益

```txt
profitInQuote = pipValueInQuote × pips
```

対象pips：

```ts
const PIP_STEPS = [1, 10, 50, 100] as const;
```

---

## 9. JPY換算仕様

### 9.1 quoteがJPYの場合

```txt
jpyValue = quoteValue
```

対象：

```txt
USDJPY
EURJPY
GBPJPY
AUDJPY
NZDJPY
CADJPY
CHFJPY
```

### 9.2 quoteがUSDの場合

```txt
jpyValue = quoteValue × USDJPY
```

対象：

```txt
EURUSD
GBPUSD
AUDUSD
NZDUSD
```

必要レート：

```txt
USDJPY
```

### 9.3 quoteがGBPの場合

```txt
jpyValue = quoteValue × GBPJPY
```

対象：

```txt
EURGBP
```

必要レート：

```txt
GBPJPY
```

### 9.4 quoteがCADの場合

対象：

```txt
USDCAD
```

優先ルール：

1. CADJPYが入力されていればCADJPYを使う
2. CADJPYがなく、USDJPYとUSDCADがあれば `CADJPY = USDJPY / USDCAD` で算出
3. どちらも無理ならエラー

```txt
jpyValue = quoteValue × CADJPY
```

### 9.5 quoteがCHFの場合

対象：

```txt
USDCHF
```

優先ルール：

1. CHFJPYが入力されていればCHFJPYを使う
2. CHFJPYがなく、USDJPYとUSDCHFがあれば `CHFJPY = USDJPY / USDCHF` で算出
3. どちらも無理ならエラー

```txt
jpyValue = quoteValue × CHFJPY
```

---

## 10. 口座通貨換算仕様

口座通貨はJPYまたはUSD。

### 10.1 口座通貨がJPY

```txt
accountValue = jpyValue
accountCurrency = JPY
```

### 10.2 口座通貨がUSD

quoteがUSDの場合：

```txt
accountValue = quoteValue
```

quoteがUSD以外の場合：

```txt
accountValue = jpyValue / USDJPY
```

この場合、USDJPYが必要。

注意：

USD口座でUSDJPYやクロス円を計算する場合、quoteはJPYなので、JPY損益をUSDに戻すためUSDJPYが必要。

例：

```txt
USDJPY 0.01lot
1pip = 10 JPY
USDJPY = 145
accountValue = 10 / 145 = 0.0689655 USD
```

---

## 11. 必要レート判定

### 11.1 基本方針

選択中の通貨ペアと口座通貨から、必要な換算レート入力欄を表示する。

### 11.2 JPY換算に必要なレート

| quote | 必要レート |
|---|---|
| JPY | 不要 |
| USD | USDJPY |
| GBP | GBPJPY |
| CAD | CADJPY または USDJPY + USDCAD |
| CHF | CHFJPY または USDJPY + USDCHF |

### 11.3 USD口座換算に必要なレート

口座通貨がUSDで、quoteがUSDではない場合：

```txt
USDJPY
```

が必要。

ただし、quoteがCADでCADJPYを使わずUSDJPY + USDCADで換算する場合、USDJPYはすでに必要。

### 11.4 入力欄表示例

#### USDJPY + USD口座

必要：

```txt
USDJPY
```

理由：

- JPY損益をUSD口座通貨へ換算するため

#### EURUSD + USD口座

必要：

```txt
USDJPY
```

理由：

- JPY換算表示に必要
- 口座通貨はquoteと同じUSDなので口座通貨換算には不要

#### EURUSD + JPY口座

必要：

```txt
USDJPY
```

理由：

- USD損益をJPY口座通貨へ換算するため
- JPY換算表示にも必要

#### EURGBP + USD口座

必要：

```txt
GBPJPY
USDJPY
```

理由：

- GBP損益をJPY換算するためGBPJPYが必要
- JPYからUSD口座通貨に戻すためUSDJPYが必要

#### USDCAD + USD口座

推奨表示：

```txt
CADJPY
USDJPY
USDCAD
```

ただしCADJPYが入力されていれば、JPY換算はCADJPYを優先する。

実装を簡単にするなら、初期実装ではCADJPYとUSDJPYを必須にしてもよい。

---

## 12. エラー仕様

### 12.1 エラー表示方針

- 入力欄の下に短いエラーを表示
- 計算不能な場合、結果テーブルは空にせず、エラー表示を出す
- 可能ならどのレートが不足しているか明示する

### 12.2 エラー文言

Lot不正：

```txt
Lotは0より大きい数値を入力してください
```

Contract Size不正：

```txt
Contract Sizeは0より大きい数値を入力してください
```

レート不正：

```txt
USDJPYは0より大きい数値を入力してください
```

必要レート不足：

```txt
計算に必要なレートが不足しています: USDJPY
```

CADJPY算出不可：

```txt
CADJPYを入力するか、USDJPYとUSDCADを入力してください
```

CHFJPY算出不可：

```txt
CHFJPYを入力するか、USDJPYとUSDCHFを入力してください
```

---

## 13. 表示仕様

### 13.1 結果テーブル

列：

```txt
Pips
Profit in Quote
Account Currency
JPY
```

例：

```txt
Pips | Profit in Quote | Account Currency | JPY
1    | 0.10 USD         | 0.10 USD         | 14.5 JPY
10   | 1.00 USD         | 1.00 USD         | 145 JPY
50   | 5.00 USD         | 5.00 USD         | 7,250 JPY
100  | 10.00 USD        | 10.00 USD        | 14,500 JPY
```

### 13.2 金額フォーマット

JPY：

```txt
小数0〜2桁
カンマ区切り
```

USD/GBP/CAD/CHF：

```txt
小数2〜4桁
カンマ区切り
```

### 13.3 推奨実装

Intl.NumberFormatを使う。

```ts
new Intl.NumberFormat("ja-JP", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})
```

ただしDecimalからnumberへ変換して表示する場合、表示用途のみ許可する。

内部計算はDecimalのまま行う。

---

## 14. localStorage仕様

### 14.1 key

```txt
fx-pip-calculator-settings
```

### 14.2 保存形式

```ts
interface PersistedSettings {
  pair: CurrencyPairSymbol;
  lot: string;
  accountCurrency: AccountCurrency;
  contractSize: string;
  rates: ExchangeRatesInput;
}
```

### 14.3 保存タイミング

- 入力値変更時
- debounceは不要
- useEffectで保存してよい

### 14.4 復元

- 初回レンダリング時に復元
- 不正データの場合はデフォルト値を使用
- JSON parseエラーは握りつぶしてデフォルト値

---

## 15. ディレクトリ構成

以下の構成で実装する。

```txt
src/
  App.tsx
  main.tsx
  index.css

  components/
    AppHeader.tsx
    InputPanel.tsx
    RateInputs.tsx
    ResultTable.tsx
    InfoPanel.tsx
    FieldError.tsx

  constants/
    currencyPairs.ts
    pipSteps.ts

  lib/
    calculator.ts
    currency.ts
    format.ts
    storage.ts
    validation.ts

  types/
    index.ts
```

---

## 16. 各ファイル責務

### 16.1 App.tsx

- アプリ全体の状態管理
- localStorage復元
- 入力値変更
- 計算関数呼び出し
- 各コンポーネント配置

### 16.2 components/InputPanel.tsx

- 通貨ペア
- Lot
- 口座通貨
- Contract Size

を表示・更新する。

### 16.3 components/RateInputs.tsx

- 必要な換算レート入力欄を表示する
- レート入力を更新する

### 16.4 components/ResultTable.tsx

- 計算結果をテーブル表示する
- エラー時はメッセージ表示する

### 16.5 components/InfoPanel.tsx

- 選択中通貨ペアの補足情報を表示する

表示例：

```txt
Base: EUR
Quote: USD
Pip Size: 0.0001
Contract Size: 100,000
```

### 16.6 lib/calculator.ts

最重要。

Reactに依存しない純粋関数だけを書く。

役割：

- pip価値計算
- JPY換算
- 口座通貨換算
- 必要レート判定
- 結果配列生成

### 16.7 lib/currency.ts

- 通貨ペア定義の検索
- quote currency取得
- pip size取得
- 必要レート名取得

### 16.8 lib/format.ts

- 金額表示フォーマット
- 通貨付き文字列生成

### 16.9 lib/storage.ts

- localStorage保存
- localStorage復元

### 16.10 lib/validation.ts

- Decimal変換
- 正数チェック
- 入力エラー生成

---

## 17. 型定義

```ts
export type CurrencyCode =
  | "JPY"
  | "USD"
  | "EUR"
  | "GBP"
  | "AUD"
  | "NZD"
  | "CAD"
  | "CHF";

export type AccountCurrency = "JPY" | "USD";

export type CurrencyPairSymbol =
  | "USDJPY"
  | "EURJPY"
  | "GBPJPY"
  | "AUDJPY"
  | "NZDJPY"
  | "CADJPY"
  | "CHFJPY"
  | "EURUSD"
  | "GBPUSD"
  | "AUDUSD"
  | "NZDUSD"
  | "USDCAD"
  | "USDCHF"
  | "EURGBP";

export type RateKey =
  | "USDJPY"
  | "GBPJPY"
  | "CADJPY"
  | "CHFJPY"
  | "USDCAD"
  | "USDCHF";

export interface CurrencyPairDefinition {
  symbol: CurrencyPairSymbol;
  base: CurrencyCode;
  quote: CurrencyCode;
  pipSize: string;
  label: string;
}

export type ExchangeRatesInput = Partial<Record<RateKey, string>>;

export interface CalculatorInput {
  pair: CurrencyPairSymbol;
  lot: string;
  accountCurrency: AccountCurrency;
  contractSize: string;
  rates: ExchangeRatesInput;
}

export interface CalculationRow {
  pips: number;
  quoteCurrency: CurrencyCode;
  quoteValue: string;
  accountCurrency: AccountCurrency;
  accountValue: string;
  jpyValue: string;
}

export interface CalculationSuccess {
  ok: true;
  pairDefinition: CurrencyPairDefinition;
  usedRates: Partial<Record<RateKey, string>>;
  rows: CalculationRow[];
}

export interface CalculationFailure {
  ok: false;
  errors: string[];
}

export type CalculationResult = CalculationSuccess | CalculationFailure;
```

---

## 18. 関数仕様

### 18.1 calculatePipProfits

```ts
export function calculatePipProfits(input: CalculatorInput): CalculationResult
```

責務：

1. 入力検証
2. 通貨ペア定義取得
3. pipValueInQuote算出
4. 各pipsごとのquoteValue算出
5. quoteValueをJPYへ換算
6. JPYを口座通貨へ換算
7. rowsを返す

### 18.2 getRequiredRateKeys

```ts
export function getRequiredRateKeys(
  pair: CurrencyPairSymbol,
  accountCurrency: AccountCurrency
): RateKey[]
```

役割：

UIに表示すべきレート入力欄を返す。

初期実装では簡単さ優先で以下でよい。

- quoteがUSD → USDJPY
- quoteがGBP → GBPJPY
- quoteがCAD → CADJPY, USDJPY, USDCAD
- quoteがCHF → CHFJPY, USDJPY, USDCHF
- accountCurrencyがUSDかつquoteがUSD以外 → USDJPY
- 重複は除外

### 18.3 parsePositiveDecimal

```ts
export function parsePositiveDecimal(value: string): Decimal | null
```

役割：

- Decimalへ変換
- 0より大きい場合のみ返す
- 不正ならnull

---

## 19. 実装上の重要ルール

### 19.1 Decimal

NG：

```ts
const value = Number(lot) * Number(contractSize) * Number(pipSize);
```

OK：

```ts
const value = new Decimal(lot)
  .mul(new Decimal(contractSize))
  .mul(new Decimal(pipSize));
```

### 19.2 React state

入力値はstringで保持する。

理由：

- `0.01` などの入力途中状態を保持しやすい
- decimal.jsで後から正確に解釈できる

### 19.3 UIと計算を分離

コンポーネント内に複雑な計算ロジックを書かない。

### 19.4 any禁止

TypeScriptでanyは使わない。

---

## 20. テスト観点

単体テストを必須実装にする必要はないが、calculator.tsは以下のケースで動くようにする。

### 20.1 USDJPY

入力：

```txt
pair=USDJPY
lot=0.01
contractSize=100000
accountCurrency=JPY
```

期待：

```txt
1pip = 10 JPY
10pip = 100 JPY
50pip = 500 JPY
100pip = 1000 JPY
```

### 20.2 EURUSD USD口座

入力：

```txt
pair=EURUSD
lot=0.01
contractSize=100000
accountCurrency=USD
USDJPY=145
```

期待：

```txt
1pip quote=0.1 USD
1pip account=0.1 USD
1pip jpy=14.5 JPY
```

### 20.3 USDJPY USD口座

入力：

```txt
pair=USDJPY
lot=0.01
contractSize=100000
accountCurrency=USD
USDJPY=145
```

期待：

```txt
1pip quote=10 JPY
1pip account=0.0689655... USD
1pip jpy=10 JPY
```

### 20.4 EURGBP USD口座

入力：

```txt
pair=EURGBP
lot=0.01
contractSize=100000
accountCurrency=USD
GBPJPY=185
USDJPY=145
```

期待：

```txt
1pip quote=0.1 GBP
1pip jpy=18.5 JPY
1pip account=0.127586... USD
```

### 20.5 USDCAD

入力：

```txt
pair=USDCAD
lot=0.01
contractSize=100000
accountCurrency=USD
USDJPY=145
USDCAD=1.35
```

期待：

```txt
1pip quote=0.1 CAD
CADJPY=107.407407...
JPY=10.740740...
USD=0.074074...
```

---

## 21. 推奨UI文言

### 21.1 タイトル

```txt
FX Pip Profit Calculator
```

### 21.2 サブタイトル

```txt
通貨ペアとLotから、1pipあたりの損益を計算します。
```

### 21.3 入力ラベル

```txt
Currency Pair
Lot
Account Currency
Contract Size
Exchange Rates
```

英語ラベルでも日本語ラベルでもよいが、全体で統一する。

推奨は英語ラベル＋補足日本語。

### 21.4 ボタン

ボタンは不要。

入力変更に応じて自動計算する。

---

## 22. デザイン方針

- 白背景
- カード型UI
- テーブルは見やすく
- 余白を多めに
- 金額は右寄せ
- エラーは赤系
- 成功結果は過度に装飾しない
- Tailwindのみで実装する
- UIライブラリは使わない

---

## 23. 実装手順

Codexは以下の順で実装すること。

1. Vite React TypeScriptプロジェクト作成
2. Tailwind CSSセットアップ
3. decimal.jsインストール
4. 型定義作成
5. 通貨ペア定数作成
6. calculator.ts実装
7. format.ts実装
8. storage.ts実装
9. InputPanel作成
10. RateInputs作成
11. ResultTable作成
12. InfoPanel作成
13. App.tsxで統合
14. 手動テスト
15. TypeScriptエラー解消
16. npm run build 実行

---

## 24. 完了条件

以下を満たしたら完了。

- `npm run build` が成功する
- USDJPYの計算が正しい
- EURUSDのJPY換算が正しい
- USD口座でUSDJPYの口座通貨換算が正しい
- 必要レート不足時にエラーが出る
- 入力値がlocalStorageに保存される
- 再読み込みで入力値が復元される
- UIがPCブラウザで崩れていない

---

## 25. package.json想定

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "decimal.js": "latest"
  },
  "devDependencies": {
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest"
  }
}
```

実際の依存関係はVite/Tailwindの標準手順に合わせてよい。

---

## 26. 補足

このアプリは、正確な金融会計ソフトではなく、個人のトレード前確認用ツールである。

ただし、金額計算の誤差を避けるため、内部計算はdecimal.jsで実装する。

将来的に、リスク管理・Lot逆算・トレード日誌へ拡張する可能性があるため、計算ロジックはUIから必ず分離すること。
