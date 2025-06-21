import { findUnselectedCurrencyObjects } from '../utils/render/updateCurrencyInput.ts';
import updateCurrencyInputDebounce from '../utils/debounce/asyncDebounce.ts';
import getConversionAmount from '../utils/api/conversionApi.ts';
import type { CurrencyOptions } from '../utils/interface/db.ts';
import type DBModule from './dbModule.ts';

class InputCurrencyModule {
  name: string;

  isRender: boolean;

  currency: CurrencyOptions;

  db: DBModule;

  constructor(name: string, currency: CurrencyOptions, db: DBModule) {
    this.name = name;
    this.isRender = false;
    this.currency = currency;
    this.db = db;
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
    return () => {
      // Enable loading banner.
      const unselectedCurrencyObjects = findUnselectedCurrencyObjects(this.name);
      unselectedCurrencyObjects.forEach((unselectedCurrencyObject) => {
        unselectedCurrencyObject.querySelector('.converter__loading')?.classList.add('converter__loading_active');
      });
      new Promise((resolve, reject) => {
        debounced(resolve, reject);
      }).catch((error) => console.error(error)); // eslint-disable-line no-console
    };
  }

  async updateCurrencyInput(cloneConvertibleCurrency?: Node) {
    let convertibleCurrency;
    if (cloneConvertibleCurrency) {
      convertibleCurrency = (cloneConvertibleCurrency as HTMLElement).querySelector('.converter__wrapper-input-toogle')!;
    } else {
      convertibleCurrency = document.querySelector(`#${this.name}`)!;
    }

    // Enable loading banner.
    convertibleCurrency.querySelector('.converter__loading')?.classList.add('converter__loading_active');

    const firstCurrency = document.querySelectorAll('.converter__wrapper-input-toogle')[0];
    if (firstCurrency) {
      const firstCurrencyNumber = firstCurrency.querySelector('.converter__textinput') as HTMLInputElement;
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
    const popup = convertibleCurrency.querySelector('.popup')!;
    const overlay = document.querySelector('.popup__overlay')!;
    return [selectArrow, popup, overlay];
  }

  openSelect() {
    const [selectArrow, popup, overlay] = this._getSelectElements();
    selectArrow.classList.add('select__arrow-rotated');
    popup.classList.remove('popup__hidden');
    overlay.classList.remove('popup__overlay-hidden');
  }

  closeSelect() {
    const [selectArrow, popup, overlay] = this._getSelectElements();
    selectArrow.classList.remove('select__arrow-rotated');
    popup.classList.add('popup__hidden');
    overlay.classList.add('popup__overlay-hidden');
  }

  setCurrence(currency?: CurrencyOptions, cloneConvertibleCurrency?: Node) {
    // Change currency in selected currency block.
    if (currency) {
      this.currency = currency;
    }
    let convertibleCurrency;
    if (cloneConvertibleCurrency) {
      convertibleCurrency = (cloneConvertibleCurrency as HTMLElement).querySelector('.converter__wrapper-input-toogle')!;
    } else {
      convertibleCurrency = document.querySelector(`#${this.name}`)!;
    }
    const currencyIcon = convertibleCurrency.querySelector('.converter__currency-icon')!;
    currencyIcon.innerHTML = this.currency.symbol;
    const currencyFlag = convertibleCurrency.querySelector('.select__flag') as HTMLImageElement;
    currencyFlag.src = this.currency.flag;
    const currencyName = convertibleCurrency.querySelector('.select__text')!;
    currencyName.textContent = this.currency.short_name;
  }

  renderCurrenciesCard() {
    const currencies = this.db.getAllСurrenciesOption();
    const currencyTemplate: HTMLTemplateElement = document.querySelector('#currencycard')!;
    const currenciesHTML = currencies.map((currency) => {
      const currencyHTML = currencyTemplate.content.cloneNode(true);
      (<HTMLImageElement>(currencyHTML as HTMLElement).querySelector('.currencycard__flag')).src = currency.flag;
      (currencyHTML as HTMLElement).querySelector('.currencycard__name')!.textContent = currency.short_name;
      (currencyHTML as HTMLElement).querySelector('.currencycard__description')!.textContent = currency.name;
      return currencyHTML;
    });
    return currenciesHTML;
  }

  render() {
    const templateConvertibleCurrency: HTMLTemplateElement = document.querySelector('#templateConvertibleCurrency')!;
    const cloneConvertibleCurrency = templateConvertibleCurrency.content.cloneNode(true);

    // add id to converter__wrapper-input-toogle.
    (cloneConvertibleCurrency as HTMLElement).querySelector('.converter__wrapper-input-toogle')!.setAttribute('id', this.name);

    // initial currency options in HTML code.
    this.setCurrence(undefined, cloneConvertibleCurrency);

    // add currencyCard in wrapper.
    const currenciesCardWrapper = (cloneConvertibleCurrency as HTMLElement).querySelector('.currencycard__wrapper')!;
    const currenciesCard = this.renderCurrenciesCard();
    currenciesCard.forEach((currencyCard) => currenciesCardWrapper.append(currencyCard));

    // update amount of currency.
    this.updateCurrencyInput(cloneConvertibleCurrency)
      .catch((error) => console.error(error)); // eslint-disable-line no-console

    this.isRender = true;
    return cloneConvertibleCurrency;
  }
}

export default InputCurrencyModule;
