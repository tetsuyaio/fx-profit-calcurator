import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { InfoPanel } from "./components/InfoPanel";
import { InputPanel } from "./components/InputPanel";
import { RateInputs } from "./components/RateInputs";
import { ResultTable } from "./components/ResultTable";
import { calculatePipProfits } from "./lib/calculator";
import { getCurrencyPairDefinition, getRequiredRateKeys } from "./lib/currency";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "./lib/storage";
import type {
  AccountCurrency,
  CurrencyPairSymbol,
  ExchangeRatesInput,
  RateKey,
} from "./types";

function pickFieldErrors(errors: string[]) {
  const rateErrors: Partial<Record<RateKey, string>> = {};
  const result = {
    lot: errors.find((error) => error.startsWith("Lot")),
    contractSize: errors.find((error) => error.startsWith("取引単位")),
    rateErrors,
  };

  const rateKeys: RateKey[] = ["USDJPY", "GBPJPY", "CADJPY", "CHFJPY", "USDCAD", "USDCHF"];
  rateKeys.forEach((key) => {
    const error = errors.find((candidate) => candidate.startsWith(key));
    if (error) {
      rateErrors[key] = error;
    }
  });

  return result;
}

export default function App() {
  const [pair, setPair] = useState<CurrencyPairSymbol>(DEFAULT_SETTINGS.pair);
  const [lot, setLot] = useState(DEFAULT_SETTINGS.lot);
  const [accountCurrency, setAccountCurrency] = useState<AccountCurrency>(
    DEFAULT_SETTINGS.accountCurrency,
  );
  const [contractSize, setContractSize] = useState(DEFAULT_SETTINGS.contractSize);
  const [rates, setRates] = useState<ExchangeRatesInput>(DEFAULT_SETTINGS.rates);

  useEffect(() => {
    const settings = loadSettings();
    setPair(settings.pair);
    setLot(settings.lot);
    setAccountCurrency(settings.accountCurrency);
    setContractSize(settings.contractSize);
    setRates(settings.rates);
  }, []);

  useEffect(() => {
    saveSettings({ pair, lot, accountCurrency, contractSize, rates });
  }, [accountCurrency, contractSize, lot, pair, rates]);

  const result = useMemo(
    () => calculatePipProfits({ pair, lot, accountCurrency, contractSize, rates }),
    [accountCurrency, contractSize, lot, pair, rates],
  );
  const requiredRateKeys = useMemo(
    () => getRequiredRateKeys(pair, accountCurrency),
    [accountCurrency, pair],
  );
  const pairDefinition = useMemo(() => getCurrencyPairDefinition(pair), [pair]);
  const fieldErrors = pickFieldErrors(result.ok ? [] : result.errors);

  function handleRateChange(key: RateKey, value: string) {
    setRates((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <AppHeader />
        <div className="grid gap-5">
          <InputPanel
            pair={pair}
            lot={lot}
            accountCurrency={accountCurrency}
            contractSize={contractSize}
            errors={{
              lot: fieldErrors.lot,
              contractSize: fieldErrors.contractSize,
            }}
            onPairChange={setPair}
            onLotChange={setLot}
            onAccountCurrencyChange={setAccountCurrency}
            onContractSizeChange={setContractSize}
          />
          <RateInputs
            rateKeys={requiredRateKeys}
            rates={rates}
            errors={fieldErrors.rateErrors}
            onRateChange={handleRateChange}
          />
          <ResultTable result={result} accountCurrency={accountCurrency} />
          <InfoPanel
            pairDefinition={pairDefinition}
            result={result}
            contractSize={contractSize}
          />
        </div>
      </div>
    </main>
  );
}
