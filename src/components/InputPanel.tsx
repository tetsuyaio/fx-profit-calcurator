import { CURRENCY_PAIRS } from "../constants/currencyPairs";
import type { AccountCurrency, CurrencyPairSymbol } from "../types";
import { FieldError } from "./FieldError";

interface InputPanelProps {
  pair: CurrencyPairSymbol;
  lot: string;
  accountCurrency: AccountCurrency;
  contractSize: string;
  errors: {
    lot?: string;
    contractSize?: string;
  };
  onPairChange: (pair: CurrencyPairSymbol) => void;
  onLotChange: (lot: string) => void;
  onAccountCurrencyChange: (currency: AccountCurrency) => void;
  onContractSizeChange: (contractSize: string) => void;
}

export function InputPanel({
  pair,
  lot,
  accountCurrency,
  contractSize,
  errors,
  onPairChange,
  onLotChange,
  onAccountCurrencyChange,
  onContractSizeChange,
}: InputPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">入力</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">通貨ペア</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            value={pair}
            onChange={(event) => onPairChange(event.target.value as CurrencyPairSymbol)}
          >
            {CURRENCY_PAIRS.map((currencyPair) => (
              <option key={currencyPair.symbol} value={currencyPair.symbol}>
                {currencyPair.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">口座通貨</span>
          <select
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            value={accountCurrency}
            onChange={(event) =>
              onAccountCurrencyChange(event.target.value as AccountCurrency)
            }
          >
            <option value="USD">USD</option>
            <option value="JPY">JPY</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Lot</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            inputMode="decimal"
            value={lot}
            onChange={(event) => onLotChange(event.target.value)}
          />
          <FieldError message={errors.lot} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">取引単位</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            inputMode="decimal"
            value={contractSize}
            onChange={(event) => onContractSizeChange(event.target.value)}
          />
          <FieldError message={errors.contractSize} />
        </label>
      </div>
    </section>
  );
}
