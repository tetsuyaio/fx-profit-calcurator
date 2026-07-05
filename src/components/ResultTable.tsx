import { formatAmount } from "../lib/format";
import type { AccountCurrency, CalculationResult } from "../types";

interface ResultTableProps {
  result: CalculationResult;
  accountCurrency: AccountCurrency;
}

export function ResultTable({ result, accountCurrency }: ResultTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-950">計算結果</h2>
        <span className="text-sm text-slate-500">口座通貨: {accountCurrency}</span>
      </div>

      {!result.ok && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      {result.ok && (
        <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">pips</th>
                <th className="px-4 py-3 text-right font-semibold">損益通貨</th>
                <th className="px-4 py-3 text-right font-semibold">口座通貨</th>
                <th className="px-4 py-3 text-right font-semibold">JPY</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr className="border-t border-slate-200" key={row.pips}>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.pips}</td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {formatAmount(row.quoteValue, row.quoteCurrency)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {formatAmount(row.accountValue, row.accountCurrency)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {formatAmount(row.jpyValue, "JPY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
