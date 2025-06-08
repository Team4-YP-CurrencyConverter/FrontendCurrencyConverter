import { findUnselectedCurrencyObjects } from '../utils/render/updateCurrencyInput.ts';
import updateCurrencyInputDebounce from '../utils/debounce/asyncDebounce.ts';
import type { CurrencyOptions } from '../utils/interface/db.ts';
import getConversionAmount from '../utils/api/conversionApi.ts';

class InputCurrencyModule {
  name: string;

  isRender: boolean;

  currency: CurrencyOptions;

  constructor(name: string, currency: CurrencyOptions) {
    this.name = name;
    this.isRender = false;
    this.currency = currency;
  }

  remove() {
    // Remove a currencie block from converter.
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    convertibleCurrency.remove();
    this.isRender = false;
  }

  _getInputElements(): [HTMLInputElement, Element | null, HTMLSpanElement] {
    // Get input currency, name currency and error.
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    const currencyInput = convertibleCurrency.querySelector('.converter__textinput') as HTMLInputElement;
    const currency = convertibleCurrency.querySelector('.select__text');
    const currencyError = convertibleCurrency.querySelector('.error') as HTMLSpanElement;
    return [currencyInput, currency, currencyError];
  }

  handleInputDebounce() {
    // Enable loading banner.
    const unselectedCurrencyObjects = findUnselectedCurrencyObjects(this.name);
    unselectedCurrencyObjects.forEach((unselectedCurrencyObject) => {
      unselectedCurrencyObject.querySelector('.converter__loading')?.classList.add('converter__loading_active');
    });

    const [
      selectedCurrencyInput,
      selectedCurrency,
      selectedCurrencyError,
    ] = this._getInputElements();
    // Update all not selected cyrrencies inputs with a 2 second delay.
    const debounced = updateCurrencyInputDebounce(
      [this.name, selectedCurrency, selectedCurrencyInput, selectedCurrencyError],
      2000,
    );
    return () => new Promise((resolve, reject) => {
      debounced(resolve, reject);
    });
  }

  async updateCurrencyInput() {
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;

    // Enable loading banner.
    convertibleCurrency.querySelector('.converter__loading')?.classList.add('converter__loading_active');

    const firstCurrency = document.querySelectorAll('.converter__wrapper-input-toogle')[0];
    const firstCurrencyNumber = firstCurrency.querySelector('.converter__textinput') as HTMLInputElement;
    if (firstCurrency !== convertibleCurrency) {
      let currencies = '';
      const firstCurrencyText = firstCurrency.querySelector('.select__text')?.innerHTML;
      const convertibleCurrencyText = convertibleCurrency.querySelector('.select__text')?.innerHTML;
      currencies += firstCurrencyText;
      currencies += convertibleCurrencyText;
      const unselectedAmounts = await getConversionAmount(
        Number(firstCurrencyNumber.value),
        currencies,
      );
      const convertibleCurrencyInput = convertibleCurrency.querySelector('.converter__textinput') as HTMLInputElement;
      convertibleCurrencyInput.value = unselectedAmounts[0].toString();
    }

    // Disable loading banner.
    convertibleCurrency.querySelector('.converter__loading')?.classList.remove('converter__loading_active');
  }

  _getSelectElements() {
    // Get Arrow, popup and overlay HTML element from currencie block.
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    const selectArrow = convertibleCurrency.querySelector('.select__arrow')!;
    const popup = convertibleCurrency.querySelector('popup')!;
    const overlay = document.querySelector('.popup__overlay')!;
    return [selectArrow, popup, overlay];
  }

  toggleSelect() {
    const [selectArrow, popup, overlay] = this._getSelectElements();
    selectArrow.classList.toggle('select__arrow-rotated');
    popup.classList.toggle('popup__hidden');
    overlay.classList.toggle('popup__overlay-hidden');
  }

  closeSelect() {
    const [selectArrow, popup, overlay] = this._getSelectElements();
    selectArrow.classList.remove('select__arrow-rotated');
    popup.classList.remove('popup__hidden');
    overlay.classList.remove('popup__overlay-hidden');
  }

  setCurrence(currency?: CurrencyOptions) {
    // Change currency in selected currency block.
    if (currency) {
      this.currency = currency;
    }
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    const currencyIcon = convertibleCurrency.querySelector('.converter__currency-icon')!;
    currencyIcon.innerHTML = this.currency.symbol;
    const currencyFlag = convertibleCurrency.querySelector('.select__flag') as HTMLImageElement;
    currencyFlag.src = this.currency.flag;
    const currencyName = convertibleCurrency.querySelector('.select__text')!;
    currencyName.textContent = this.currency.short_name;
  }

  render() {
    const templateConvertibleCurrency: HTMLTemplateElement = document.querySelector('#templateConvertibleCurrency')!;
    const convertibleCurrency = templateConvertibleCurrency.content.cloneNode(true);
    this.isRender = true;
    return convertibleCurrency;
  }
}

export default InputCurrencyModule;
