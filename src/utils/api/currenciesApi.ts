import api from './api.ts';

interface ICurrenciesResponse {
  id: string,
  name: string,
  short_name: string,
  symbol: string,
  flag: string,
  exchange_rate: number,
  er_dynamics: number
}

async function getCurrencies() {
  try {
    return await api<ICurrenciesResponse[]>({
      method: 'GET',
      endPath: '/currencies',
    });
  } catch (error) {
    return error;
  }
}

export default getCurrencies;
