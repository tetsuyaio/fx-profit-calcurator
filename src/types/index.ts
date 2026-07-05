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

export interface PersistedSettings {
  pair: CurrencyPairSymbol;
  lot: string;
  accountCurrency: AccountCurrency;
  contractSize: string;
  rates: ExchangeRatesInput;
}
