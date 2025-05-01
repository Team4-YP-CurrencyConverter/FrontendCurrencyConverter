import api from './api.ts';
import type { ICurrencies } from '../interface/db.ts';

async function getCurrencies(): Promise<ICurrencies[]> {
  try {
    return await api<ICurrencies[]>({
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
