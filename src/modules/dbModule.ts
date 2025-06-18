import type { DB, AdvancedCurrencyOptions } from '../utils/interface/db.ts';

class DBModule {
  db: DB;

  constructor() {
    this.db = {
      currencies: [],
    };
  }

  addCurrencies(currency: AdvancedCurrencyOptions) {
    const foundCurrentId = this.db.currencies.findIndex(
      (oldCurrency) => oldCurrency.id === currency.id,
    );
    if (foundCurrentId === -1) {
      this.db.currencies.push(currency);
    } else {
      this.db.currencies[foundCurrentId] = currency;
    }
  }

  getCurrencyOption(id: string) {
    const targetCurrency = this.db.currencies.find((currency) => currency.id === id)!;
    const currencyOption = {
      short_name: targetCurrency.short_name,
      name: targetCurrency.name,
      symbol: targetCurrency.symbol,
      flag: targetCurrency.flag,
    };
    return currencyOption;
  }

  getAllСurrenciesOption() {
    const currenciesOption = this.db.currencies.map((currency) => {
      const currencyOption = {
        short_name: currency.short_name,
        name: currency.name,
        symbol: currency.symbol,
        flag: currency.flag,
      };
      return currencyOption;
    });
    return currenciesOption;
  }
}

export default DBModule;
