import api from './api.ts';

async function getConversionAmount(amount: number, currencies: string): Promise<number[]> {
  try {
    return await api<number[]>({
      method: 'GET',
      endPath: `/conversion?&amount=${amount}&currencies=${currencies}`,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
}

export default getConversionAmount;
