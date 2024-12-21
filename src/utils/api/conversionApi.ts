import api from './api.ts';

interface IConversionAmountResponse {
  amounts: number[],
}

async function getConversionAmount(amount: number, currencies: string) {
  try {
    return await api<IConversionAmountResponse>({
      method: 'GET',
      endPath: `/conversion?amount=${amount}&currencies=${currencies}`,
    });
  } catch (error) {
    return error;
  }
}

export default getConversionAmount;
