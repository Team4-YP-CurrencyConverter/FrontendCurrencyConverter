interface CurrencyOptions {
  short_name: string,
  name: string,
  symbol: string,
  flag: string,
}

interface AdvancedCurrencyOptions extends CurrencyOptions {
  id: string,
  exchange_rate: number,
  er_dynamics: number,
}

interface DB {
  currencies: AdvancedCurrencyOptions[],
}

export type { CurrencyOptions, AdvancedCurrencyOptions, DB };
