import { CURRENCY_PAIR_SYMBOLS } from "../constants/currencyPairs";
import type {
  AccountCurrency,
  CurrencyPairSymbol,
  ExchangeRatesInput,
  PersistedSettings,
  RateKey,
} from "../types";

export const STORAGE_KEY = "fx-pip-calculator-settings";

const DEFAULT_RATES: ExchangeRatesInput = {
  USDJPY: "145",
  GBPJPY: "185",
  CADJPY: "107",
  CHFJPY: "165",
  USDCAD: "1.35",
  USDCHF: "0.88",
};

export const DEFAULT_SETTINGS: PersistedSettings = {
  pair: "USDJPY",
  lot: "0.01",
  accountCurrency: "USD",
  contractSize: "100000",
  rates: DEFAULT_RATES,
};

function isPair(value: unknown): value is CurrencyPairSymbol {
  return typeof value === "string" && CURRENCY_PAIR_SYMBOLS.includes(value as CurrencyPairSymbol);
}

function isAccountCurrency(value: unknown): value is AccountCurrency {
  return value === "JPY" || value === "USD";
}

function sanitizeRates(value: unknown): ExchangeRatesInput {
  if (!value || typeof value !== "object") {
    return DEFAULT_RATES;
  }

  const allowedKeys: RateKey[] = ["USDJPY", "GBPJPY", "CADJPY", "CHFJPY", "USDCAD", "USDCHF"];
  const input = value as Partial<Record<RateKey, unknown>>;
  const rates: ExchangeRatesInput = { ...DEFAULT_RATES };

  allowedKeys.forEach((key) => {
    if (typeof input[key] === "string") {
      rates[key] = input[key];
    }
  });

  return rates;
}

export function loadSettings(): PersistedSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
    return {
      pair: isPair(parsed.pair) ? parsed.pair : DEFAULT_SETTINGS.pair,
      lot: typeof parsed.lot === "string" ? parsed.lot : DEFAULT_SETTINGS.lot,
      accountCurrency: isAccountCurrency(parsed.accountCurrency)
        ? parsed.accountCurrency
        : DEFAULT_SETTINGS.accountCurrency,
      contractSize:
        typeof parsed.contractSize === "string"
          ? parsed.contractSize
          : DEFAULT_SETTINGS.contractSize,
      rates: sanitizeRates(parsed.rates),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PersistedSettings): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage may be unavailable in private or restricted browser contexts.
  }
}
