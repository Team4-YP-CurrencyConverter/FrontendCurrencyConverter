/* eslint-disable no-unused-vars */
import debounce from 'debounce';
import { updateCurrencyInput } from '../../render/updateCurrencyInput.ts';

type updateCurrencyInputArgs = [
  string,
  Element | null | undefined,
  HTMLInputElement,
  HTMLSpanElement,
];

function updateCurrencyInputDebounce(args: updateCurrencyInputArgs, wait: number) {
  const debounced = debounce((
    resolve: (value: unknown) => void,
    reject: (reason?: unknown) => void,
  ) => {
    updateCurrencyInput(...args).then(resolve).catch(reject);
  }, wait);
  return () => new Promise((resolve, reject) => {
    debounced(resolve, reject);
  });
}

export default updateCurrencyInputDebounce;
