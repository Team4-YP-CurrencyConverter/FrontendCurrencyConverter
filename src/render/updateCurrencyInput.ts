import getConversionAmount from '../utils/api/conversionApi.ts';
import CURRENCYOBJECTIDS from '../utils/constants/currencyObjectIds.ts';
import { CheckIsValid, schemaCurrencyValue } from '../validation/index.ts';

function findUnselectedCurrencyObjects(id: string) {
  // Initialization variables of all active (but, not selected) cyrrencies.
  const unselectedCurrencyObjects = CURRENCYOBJECTIDS
    .filter((unselectedId) => (
      unselectedId !== id
    ))
    .map((unselectedId) => document.getElementById(unselectedId) as HTMLElement)
    .filter((unselectedObjects) => !Object.values(unselectedObjects.classList).includes('converter__input_hidden'));
  return unselectedCurrencyObjects;
}

function enableLoadingBanner(id: string) {
  const unselectedCurrencyObjects = findUnselectedCurrencyObjects(id);
  unselectedCurrencyObjects.forEach((unselectedCurrencyObject) => {
    unselectedCurrencyObject.querySelector('.converter__loading')?.classList.add('converter__loading_active');
  });
}

async function updateCurrencyInput(
  id: string,
  selectedCurrency: Element | null | undefined,
  selectedCurrencyInput: HTMLInputElement,
  selectedCurrencyError: HTMLSpanElement,
) {
  const unselectedCurrencyObjects = findUnselectedCurrencyObjects(id);
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
      // Disable loading banner.
      unselectedCurrencyObject.querySelector('.converter__loading')?.classList.remove('converter__loading_active');
    });
  } else if (selectedCurrencyInput.value === '') {
    unselectedCurrencyObjects.forEach((unselectedCurrencyObject) => {
      const unselectedCurrencyInput = unselectedCurrencyObject.querySelector('.converter__textinput') as HTMLInputElement;
      unselectedCurrencyInput.value = '';
      // Disable loading banner.
      unselectedCurrencyObject.querySelector('.converter__loading')?.classList.remove('converter__loading_active');
    });
  }
}

export { enableLoadingBanner, updateCurrencyInput };
