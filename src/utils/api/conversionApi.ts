import api from './api.ts';

interface IConversionAmountResponse {
  amounts: number[],
}

async function getConversionAmount(amount: number, currencies: string) {
  try {
    return await api<IConversionAmountResponse>({
      method: 'GET',
      // fix: I don`t now why /conversion?amount=${amount}, return Nan
      endPath: `/conversion?&amount=${amount}&currencies=${currencies}`,
    });
  } catch (error) {
    return error;
  }
}

export default getConversionAmount;
