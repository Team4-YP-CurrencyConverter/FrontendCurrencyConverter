interface ICurrencies {
  id: string,
  name: string,
  short_name: string,
  symbol: string,
  flag: string,
  exchange_rate: number,
  er_dynamics: number,
}

interface IDB {
  currencies: ICurrencies[],
}

export type { ICurrencies, IDB };
