import type { DB, CurrencyOptions, AdvancedCurrencyOptions } from '../utils/interface/db.ts';

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

  getCurrencyOption(id?: string): CurrencyOptions[] {
    // If don`t used id, return all currencies.
    let currencies;
    if (id) {
      currencies = this.db.currencies.filter((currency) => currency.id === id)!;
    } else {
      currencies = this.db.currencies;
    }
    const currenciesOption = currencies.map((currency) => {
      const currencyOption = {
        id: currency.id,
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
