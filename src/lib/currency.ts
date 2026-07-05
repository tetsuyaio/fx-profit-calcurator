import { CURRENCY_PAIRS } from "../constants/currencyPairs";
import type {
  AccountCurrency,
  CurrencyPairDefinition,
  CurrencyPairSymbol,
  RateKey,
} from "../types";

export function getCurrencyPairDefinition(
  symbol: CurrencyPairSymbol,
): CurrencyPairDefinition {
  const pair = CURRENCY_PAIRS.find((candidate) => candidate.symbol === symbol);
  if (!pair) {
    throw new Error(`Unknown currency pair: ${symbol}`);
  }
  return pair;
}

export function getRequiredRateKeys(
  pair: CurrencyPairSymbol,
  accountCurrency: AccountCurrency,
): RateKey[] {
  const definition = getCurrencyPairDefinition(pair);
  const keys = new Set<RateKey>();

  if (definition.quote === "USD") {
    keys.add("USDJPY");
  }

  if (definition.quote === "GBP") {
    keys.add("GBPJPY");
  }

  if (definition.quote === "CAD") {
    keys.add("CADJPY");
    keys.add("USDJPY");
    keys.add("USDCAD");
  }

  if (definition.quote === "CHF") {
    keys.add("CHFJPY");
    keys.add("USDJPY");
    keys.add("USDCHF");
  }

  if (accountCurrency === "USD" && definition.quote !== "USD") {
    keys.add("USDJPY");
  }

  return Array.from(keys);
}
