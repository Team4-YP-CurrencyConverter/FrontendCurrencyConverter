import { enableLoadingBanner } from '../../render/updateCurrencyInput.ts';
import updateCurrencyInputDebounce from '../debounce/asyncDebounce.ts';

const handleConverionInput = (id:string) => {
  // Initialization of variables of the selected cyrrency, its input, short name and error field.
  const selectedCurrencyObject = document.getElementById(id);
  const selectedCurrencyInput = selectedCurrencyObject?.querySelector('.converter__textinput') as HTMLInputElement;
  const selectedCurrency = selectedCurrencyObject?.querySelector('.select__text');
  const selectedCurrencyError = selectedCurrencyObject?.querySelector('.error') as HTMLSpanElement;

  selectedCurrencyInput?.addEventListener('input', () => enableLoadingBanner(id));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  selectedCurrencyInput?.addEventListener('input', updateCurrencyInputDebounce(
    [id, selectedCurrency, selectedCurrencyInput, selectedCurrencyError],
    1000,
  ));
};

export default handleConverionInput;
