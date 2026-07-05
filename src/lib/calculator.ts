import Decimal from "decimal.js";
import { PIP_STEPS } from "../constants/pipSteps";
import { getCurrencyPairDefinition } from "./currency";
import { parsePositiveDecimal } from "./validation";
import type {
  CalculatorInput,
  CalculationResult,
  CurrencyCode,
  ExchangeRatesInput,
  RateKey,
} from "../types";

type ParsedRates = Partial<Record<RateKey, Decimal>>;

function parseRates(rates: ExchangeRatesInput): {
  parsedRates: ParsedRates;
  errors: string[];
} {
  const parsedRates: ParsedRates = {};
  const errors: string[] = [];

  (Object.keys(rates) as RateKey[]).forEach((key) => {
    const value = rates[key];
    if (value === undefined || value.trim() === "") {
      return;
    }

    const parsed = parsePositiveDecimal(value);
    if (!parsed) {
      errors.push(`${key}は0より大きい数値を入力してください`);
      return;
    }

    parsedRates[key] = parsed;
  });

  return { parsedRates, errors };
}

function rateToJpy(
  quote: CurrencyCode,
  rates: ParsedRates,
): { rate: Decimal; usedRates: Partial<Record<RateKey, string>> } | { error: string } {
  if (quote === "JPY") {
    return { rate: new Decimal(1), usedRates: {} };
  }

  if (quote === "USD") {
    if (!rates.USDJPY) {
      return { error: "計算に必要なレートが不足しています: USDJPY" };
    }
    return { rate: rates.USDJPY, usedRates: { USDJPY: rates.USDJPY.toString() } };
  }

  if (quote === "GBP") {
    if (!rates.GBPJPY) {
      return { error: "計算に必要なレートが不足しています: GBPJPY" };
    }
    return { rate: rates.GBPJPY, usedRates: { GBPJPY: rates.GBPJPY.toString() } };
  }

  if (quote === "CAD") {
    if (rates.CADJPY) {
      return { rate: rates.CADJPY, usedRates: { CADJPY: rates.CADJPY.toString() } };
    }
    if (rates.USDJPY && rates.USDCAD) {
      return {
        rate: rates.USDJPY.div(rates.USDCAD),
        usedRates: {
          USDJPY: rates.USDJPY.toString(),
          USDCAD: rates.USDCAD.toString(),
        },
      };
    }
    return { error: "CADJPYを入力するか、USDJPYとUSDCADを入力してください" };
  }

  if (quote === "CHF") {
    if (rates.CHFJPY) {
      return { rate: rates.CHFJPY, usedRates: { CHFJPY: rates.CHFJPY.toString() } };
    }
    if (rates.USDJPY && rates.USDCHF) {
      return {
        rate: rates.USDJPY.div(rates.USDCHF),
        usedRates: {
          USDJPY: rates.USDJPY.toString(),
          USDCHF: rates.USDCHF.toString(),
        },
      };
    }
    return { error: "CHFJPYを入力するか、USDJPYとUSDCHFを入力してください" };
  }

  return { error: `未対応の損益通貨です: ${quote}` };
}

export function calculatePipProfits(input: CalculatorInput): CalculationResult {
  const errors: string[] = [];
  const lot = parsePositiveDecimal(input.lot);
  const contractSize = parsePositiveDecimal(input.contractSize);
  const { parsedRates, errors: rateErrors } = parseRates(input.rates);
  errors.push(...rateErrors);

  if (!lot) {
    errors.push("Lotは0より大きい数値を入力してください");
  }

  if (!contractSize) {
    errors.push("取引単位は0より大きい数値を入力してください");
  }

  if (errors.length > 0 || !lot || !contractSize) {
    return { ok: false, errors };
  }

  const pairDefinition = getCurrencyPairDefinition(input.pair);
  const pipValueInQuote = lot
    .mul(contractSize)
    .mul(new Decimal(pairDefinition.pipSize));

  const jpyRateResult = rateToJpy(pairDefinition.quote, parsedRates);
  if ("error" in jpyRateResult) {
    return { ok: false, errors: [jpyRateResult.error] };
  }

  const usedRates = { ...jpyRateResult.usedRates };

  if (input.accountCurrency === "USD" && pairDefinition.quote !== "USD") {
    if (!parsedRates.USDJPY) {
      return { ok: false, errors: ["計算に必要なレートが不足しています: USDJPY"] };
    }
    usedRates.USDJPY = parsedRates.USDJPY.toString();
  }

  const rows = PIP_STEPS.map((pips) => {
    const quoteValue = pipValueInQuote.mul(pips);
    const jpyValue = quoteValue.mul(jpyRateResult.rate);
    const accountValue =
      input.accountCurrency === "JPY"
        ? jpyValue
        : pairDefinition.quote === "USD"
          ? quoteValue
          : jpyValue.div(parsedRates.USDJPY as Decimal);

    return {
      pips,
      quoteCurrency: pairDefinition.quote,
      quoteValue: quoteValue.toString(),
      accountCurrency: input.accountCurrency,
      accountValue: accountValue.toString(),
      jpyValue: jpyValue.toString(),
    };
  });

  return {
    ok: true,
    pairDefinition,
    usedRates,
    rows,
  };
}
