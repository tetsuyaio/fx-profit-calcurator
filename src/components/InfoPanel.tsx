import { formatOptionalNumber } from "../lib/format";
import type { CalculationResult, CurrencyPairDefinition } from "../types";

interface InfoPanelProps {
  pairDefinition: CurrencyPairDefinition;
  result: CalculationResult;
  contractSize: string;
}

export function InfoPanel({ pairDefinition, result, contractSize }: InfoPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">補足情報</h2>
      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-4">
        <div>
          <dt className="text-slate-500">基軸通貨</dt>
          <dd className="mt-1 font-medium text-slate-950">{pairDefinition.base}</dd>
        </div>
        <div>
          <dt className="text-slate-500">損益通貨</dt>
          <dd className="mt-1 font-medium text-slate-950">{pairDefinition.quote}</dd>
        </div>
        <div>
          <dt className="text-slate-500">pipサイズ</dt>
          <dd className="mt-1 font-medium text-slate-950">{pairDefinition.pipSize}</dd>
        </div>
        <div>
          <dt className="text-slate-500">取引単位</dt>
          <dd className="mt-1 font-medium text-slate-950">
            {formatOptionalNumber(contractSize)}
          </dd>
        </div>
      </dl>

      {result.ok && Object.keys(result.usedRates).length > 0 && (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-800">使用レート</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(result.usedRates).map(([key, value]) => (
              <span
                className="rounded-md bg-slate-100 px-2.5 py-1 text-sm text-slate-700"
                key={key}
              >
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
