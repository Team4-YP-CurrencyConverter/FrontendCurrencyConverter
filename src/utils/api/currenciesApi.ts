import api from './api.ts';

interface ICurrenciesResponse {
  id: number,
  name: string,
  short_name: string,
  symbol: string,
  flag: string,
  exchange_rate: number,
  er_dynamics: number
}

async function getCurrencies(): Promise<ICurrenciesResponse[]> {
  try {
    return await api<ICurrenciesResponse[]>({
      method: 'GET',
      endPath: '/currencies',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
}

export default getCurrencies;
