interface ICurrencies {
  id: string,
  name: string,
  short_name: string,
  symbol: string,
  flag: string,
  exchange_rate: object | number,
  er_dynamics: object | number,
}

interface IDb {
  currencies: ICurrencies[],
}

export type { ICurrencies, IDb };
