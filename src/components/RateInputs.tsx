import type { ExchangeRatesInput, RateKey } from "../types";
import { FieldError } from "./FieldError";

const RATE_LABELS: Record<RateKey, string> = {
  USDJPY: "USD/JPY",
  GBPJPY: "GBP/JPY",
  CADJPY: "CAD/JPY",
  CHFJPY: "CHF/JPY",
  USDCAD: "USD/CAD",
  USDCHF: "USD/CHF",
};

interface RateInputsProps {
  rateKeys: RateKey[];
  rates: ExchangeRatesInput;
  errors: Partial<Record<RateKey, string>>;
  onRateChange: (key: RateKey, value: string) => void;
}

export function RateInputs({
  rateKeys,
  rates,
  errors,
  onRateChange,
}: RateInputsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">換算レート</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {rateKeys.map((key) => (
          <label className="block" key={key}>
            <span className="text-sm font-medium text-slate-700">{RATE_LABELS[key]}</span>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              inputMode="decimal"
              value={rates[key] ?? ""}
              onChange={(event) => onRateChange(key, event.target.value)}
            />
            <FieldError message={errors[key]} />
          </label>
        ))}
      </div>
    </section>
  );
}
