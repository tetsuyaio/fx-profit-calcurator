import Decimal from "decimal.js";
import type { CurrencyCode } from "../types";

function decimalToDisplayNumber(value: string): number {
  return new Decimal(value).toNumber();
}

export function formatAmount(value: string, currency: CurrencyCode): string {
  const formatter = new Intl.NumberFormat("ja-JP", {
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" ? 2 : 4,
  });

  return `${formatter.format(decimalToDisplayNumber(value))} ${currency}`;
}

export function formatPlainNumber(value: string): string {
  try {
    const formatter = new Intl.NumberFormat("ja-JP", {
      maximumFractionDigits: 4,
    });
    return formatter.format(decimalToDisplayNumber(value));
  } catch {
    return value;
  }
}

export function formatOptionalNumber(value: string): string {
  if (!value.trim()) {
    return "-";
  }

  try {
    const decimal = new Decimal(value);
    if (!decimal.isFinite()) {
      return value;
    }
  } catch {
    return value;
  }

  const formatter = new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 4,
  });
  return formatter.format(decimalToDisplayNumber(value));
}
