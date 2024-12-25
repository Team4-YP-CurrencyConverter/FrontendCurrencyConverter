/* eslint-disable no-undef */
import { CheckIsValid, schemaCurrencyValue } from '../../validation/index.ts';
import getConversionAmount from '../api/conversionApi.ts';
import CURRENCYOBJECTIDS from '../constants/currencyObjectIds.ts';

const handleConverionInput = (id:string) => {
  // Initialization of variables of the selected cyrrency, its input, short name and error field.
  const selectedCurrencyObject = document.getElementById(id);
  const selectedCurrencyInput = selectedCurrencyObject?.querySelector('.converter__textinput') as HTMLInputElement;
  const selectedCurrency = selectedCurrencyObject?.querySelector('.select__text');
  const selectedCurrencyError = selectedCurrencyObject?.querySelector('.error') as HTMLSpanElement;

  selectedCurrencyInput?.addEventListener('input', () => {
    // eslint-disable-next-line no-void
    void (async () => {
      // Initialization of variables of all active (but, not selected) cyrrencies.
      const unselectedCurrencyObjects = CURRENCYOBJECTIDS
        .filter((unselectedId) => (
          unselectedId !== id
        ))
        .map((unselectedId) => document.getElementById(unselectedId) as HTMLElement)
        .filter((unselectedObjects) => !Object.values(unselectedObjects.classList).includes('converter__input_hidden'));

      CheckIsValid(schemaCurrencyValue, selectedCurrencyInput.value, selectedCurrencyError);
      if (!selectedCurrencyError.innerText) {
        // Initialization of a variable that contains all active currencies.
        let currencies = '';
        currencies += selectedCurrency?.innerHTML as string;

        unselectedCurrencyObjects.forEach((unselectedCurrencyObject) => {
          const unselectedCurrency = unselectedCurrencyObject?.querySelector('.select__text')?.innerHTML;
          currencies += unselectedCurrency;
        });

        const unselectedAmounts = await getConversionAmount(
          Number(selectedCurrencyInput.value),
          currencies,
        );

        // Recording amounts received from the server in the input of active currencies.
        let unselectedAmountsIndex = 0;
        unselectedCurrencyObjects.forEach((unselectedCurrencyObject) => {
          const unselectedCurrencyInput = unselectedCurrencyObject.querySelector('.converter__textinput') as HTMLInputElement;
          unselectedCurrencyInput.value = unselectedAmounts[unselectedAmountsIndex].toString();
          unselectedAmountsIndex += 1;
        });
      } else if (selectedCurrencyInput.value === '') {
        unselectedCurrencyObjects.forEach((unselectedCurrencyObject) => {
          const unselectedCurrencyInput = unselectedCurrencyObject.querySelector('.converter__textinput') as HTMLInputElement;
          unselectedCurrencyInput.value = '';
        });
      }
    })();
  });
};

export default handleConverionInput;
