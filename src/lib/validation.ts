import Decimal from "decimal.js";

export function parsePositiveDecimal(value: string): Decimal | null {
  try {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const decimal = new Decimal(trimmed);
    return decimal.isFinite() && decimal.gt(0) ? decimal : null;
  } catch {
    return null;
  }
}
