import type { CurrencyPairDefinition, CurrencyPairSymbol } from "../types";

export const CURRENCY_PAIRS: CurrencyPairDefinition[] = [
  { symbol: "USDJPY", base: "USD", quote: "JPY", pipSize: "0.01", label: "USD/JPY" },
  { symbol: "EURJPY", base: "EUR", quote: "JPY", pipSize: "0.01", label: "EUR/JPY" },
  { symbol: "GBPJPY", base: "GBP", quote: "JPY", pipSize: "0.01", label: "GBP/JPY" },
  { symbol: "AUDJPY", base: "AUD", quote: "JPY", pipSize: "0.01", label: "AUD/JPY" },
  { symbol: "NZDJPY", base: "NZD", quote: "JPY", pipSize: "0.01", label: "NZD/JPY" },
  { symbol: "CADJPY", base: "CAD", quote: "JPY", pipSize: "0.01", label: "CAD/JPY" },
  { symbol: "CHFJPY", base: "CHF", quote: "JPY", pipSize: "0.01", label: "CHF/JPY" },
  { symbol: "EURUSD", base: "EUR", quote: "USD", pipSize: "0.0001", label: "EUR/USD" },
  { symbol: "GBPUSD", base: "GBP", quote: "USD", pipSize: "0.0001", label: "GBP/USD" },
  { symbol: "AUDUSD", base: "AUD", quote: "USD", pipSize: "0.0001", label: "AUD/USD" },
  { symbol: "NZDUSD", base: "NZD", quote: "USD", pipSize: "0.0001", label: "NZD/USD" },
  { symbol: "USDCAD", base: "USD", quote: "CAD", pipSize: "0.0001", label: "USD/CAD" },
  { symbol: "USDCHF", base: "USD", quote: "CHF", pipSize: "0.0001", label: "USD/CHF" },
  { symbol: "EURGBP", base: "EUR", quote: "GBP", pipSize: "0.0001", label: "EUR/GBP" },
];

export const CURRENCY_PAIR_SYMBOLS = CURRENCY_PAIRS.map(
  (pair) => pair.symbol,
) as CurrencyPairSymbol[];
