import api from './api.ts';
import type { AdvancedCurrencyOptions } from '../interface/db.ts';

async function getCurrencies(): Promise<AdvancedCurrencyOptions[]> {
  try {
    return await api<AdvancedCurrencyOptions[]>({
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
