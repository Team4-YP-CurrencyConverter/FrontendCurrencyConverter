import type { IDB, ICurrencies } from '../utils/interface/db.ts';

class DBModule {
  db: IDB;

  constructor() {
    this.db = {
      currencies: [],
    };
  }

  addCurrencies(currency: ICurrencies) {
    const foundCurrentId = this.db.currencies.findIndex(
      (oldCurrency) => oldCurrency.id === currency.id,
    );
    if (foundCurrentId === -1) {
      this.db.currencies.push(currency);
    } else {
      this.db.currencies[foundCurrentId] = currency;
    }
  }
}

export default DBModule;
