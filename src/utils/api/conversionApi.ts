import debounce from 'debounce';
import api from './api.ts';

async function getConversionAmount(amount: number, currencies: string): Promise<number[]> {
  try {
    return await api<number[]>({
      method: 'GET',
      // fix: I don`t now why /conversion?amount=${amount}, return Nan
      endPath: `/conversion?&amount=${amount}&currencies=${currencies}`,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
}

function getConversionAmountDebounce(amount: number, currencies: string): () => Promise<number[]> {
  const debounced = debounce((
    // eslint-disable-next-line no-unused-vars
    resolve: (value: number[] | PromiseLike<number[]>) => void,
    // eslint-disable-next-line no-unused-vars
    reject: (reason?: unknown) => void,
    args: [number, string],
  ) => {
    // eslint-disable-next-line no-console
    getConversionAmount(...args).then(resolve).catch(reject).catch((error) => console.error(error));
  }, 1000);

  function returnFunc(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      debounced(resolve, reject, [amount, currencies]);
    });
  }

  return returnFunc;
}

export { getConversionAmount, getConversionAmountDebounce };
