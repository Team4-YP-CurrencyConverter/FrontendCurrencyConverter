/* eslint-disable no-unused-vars */
import debounce from 'debounce';
import { findUnselectedCurrencyObjects, updateCurrencyInput } from '../utils/render/updateCurrencyInput.ts';

class InputCurrencyModule {
  name: string;

  isRender: boolean;

  constructor(name: string) {
    this.name = name;
    this.isRender = false;
  }

  remove() {
    // Remove a currencie block from converter.
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    convertibleCurrency.remove();
    this.isRender = false;
  }

  handleInputDebounce() {
    // Enable loading banner.
    const unselectedCurrencyObjects = findUnselectedCurrencyObjects(this.name);
    unselectedCurrencyObjects.forEach((unselectedCurrencyObject) => {
      unselectedCurrencyObject.querySelector('.converter__loading')?.classList.add('converter__loading_active');
    });

    // Get input currency, name currency and error.
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    const selectedCurrencyInput = convertibleCurrency.querySelector('.converter__textinput') as HTMLInputElement;
    const selectedCurrency = convertibleCurrency.querySelector('.select__text');
    const selectedCurrencyError = convertibleCurrency.querySelector('.error') as HTMLSpanElement;

    // Update all not selected cyrrencies inputs with a 2 second delay.
    const debounced = debounce((
      resolve: (value: unknown) => void,
      reject: (reason?: unknown) => void,
    ) => {
      updateCurrencyInput(this.name, selectedCurrency, selectedCurrencyInput, selectedCurrencyError)
        .then(resolve)
        .catch(reject);
    }, 2000);
    return () => new Promise((resolve, reject) => {
      debounced(resolve, reject);
    });
  }

  static _getSelectElements() {
    // Get Arrow, popup and overlay HTML element from currencie block.
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    const selectArrow = convertibleCurrency.querySelector('.select__arrow')!;
    const popup = convertibleCurrency.querySelector('popup')!;
    const overlay = document.querySelector('.popup__overlay')!;
    return [selectArrow, popup, overlay];
  }

  static toggleSelect() {
    const [selectArrow, popup, overlay] = this._getSelectElements();
    selectArrow.classList.toggle('select__arrow-rotated');
    popup.classList.toggle('popup__hidden');
    overlay.classList.toggle('popup__overlay-hidden');
  }

  static closeSelect() {
    const [selectArrow, popup, overlay] = this._getSelectElements();
    selectArrow.classList.remove('select__arrow-rotated');
    popup.classList.remove('popup__hidden');
    overlay.classList.remove('popup__overlay-hidden');
  }

  setCurrence(currency: {icon: string, flag: string, text: string}) {
    // Change currency in selected currency block.
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    const currencyIcon = convertibleCurrency.querySelector('converter__currency-icon')!;
    currencyIcon.textContent = currency.icon;
    const currencyFlag = convertibleCurrency.querySelector('select__flag') as HTMLImageElement;
    currencyFlag.src = currency.flag;
    const currencyName = convertibleCurrency.querySelector('select__text')!;
    currencyName.textContent = currency.text;
  }

  render() {
    const templateConvertibleCurrency: HTMLTemplateElement = document.querySelector('#templateConvertibleCurrency')!;
    const convertibleCurrency = templateConvertibleCurrency.content.cloneNode(true);
    this.isRender = true;
    return convertibleCurrency;
  }
}

export default InputCurrencyModule;
