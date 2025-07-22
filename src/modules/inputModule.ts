import { findUnselectedCurrencyObjects } from '../utils/render/updateCurrencyInput.ts';
import updateCurrencyInputDebounce from '../utils/debounce/asyncDebounce.ts';
import getConversionAmount from '../utils/api/conversionApi.ts';
import type DBModule from './dbModule.ts';

class InputCurrencyModule {
  name: string;

  isRender: boolean;

  currencyId: string;

  db: DBModule;

  constructor(name: string, currencyId: string, db: DBModule) {
    this.name = name;
    this.isRender = false;
    this.currencyId = currencyId;
    this.db = db;
  }

  remove() {
    // Remove a currencie block from converter.
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    convertibleCurrency.remove();
    this.isRender = false;
  }

  getInputElements(): [HTMLInputElement, Element | null, HTMLSpanElement] {
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
    ] = this.getInputElements();
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

  addLoadingBanner() {
    document.querySelector(`#${this.name}`)?.querySelector('.converter__loading')?.classList.add('converter__loading_active');
  }

  removeLoadingBanner() {
    document.querySelector(`#${this.name}`)?.querySelector('.converter__loading')?.classList.remove('converter__loading_active');
  }

  updateAmountofCurrency(amountofCurrency: string) {
    const currencyInput = document.querySelector(`#${this.name}`)?.querySelector('.converter__textinput') as HTMLInputElement;
    currencyInput.value = amountofCurrency;
    this.removeLoadingBanner();
  }

  setCurrency(currencyId?: string, cloneConvertibleCurrency?: Node) {
    // Change currency in selected currency block.
    if (currencyId) {
      this.currencyId = currencyId;
    }
    let convertibleCurrency;
    if (cloneConvertibleCurrency) {
      convertibleCurrency = (cloneConvertibleCurrency as HTMLElement).querySelector('.converter__wrapper-input-toogle')!;
    } else {
      convertibleCurrency = document.querySelector(`#${this.name}`)!;
      this.closeSelect();
    }
    const currency = this.db.getCurrencyOption(this.currencyId)[0];
    const currencyIcon = convertibleCurrency.querySelector('.converter__currency-icon')!;
    currencyIcon.innerHTML = currency.symbol;
    const currencyFlag = convertibleCurrency.querySelector('.select__flag') as HTMLImageElement;
    currencyFlag.src = currency.flag;
    const currencyName = convertibleCurrency.querySelector('.select__text')!;
    currencyName.textContent = currency.short_name;
    this.removingVisibilityCurrenciesCards(convertibleCurrency);
  }

  removingVisibilityCurrenciesCards(ConvertibleCurrency: Element, ids?: string[]) {
    // Hidden currencies cards matching with selected currency or by id`s.
    const currenciesCards = ConvertibleCurrency.querySelectorAll('.currencycard');
    currenciesCards.forEach((currencyCard) => {
      let conditionCardsVisibility;
      if (ids) {
        conditionCardsVisibility = currencyCard.id in ids || currencyCard.id === this.currencyId;
      } else {
        conditionCardsVisibility = currencyCard.id === this.currencyId;
      }
      if (conditionCardsVisibility) {
        currencyCard.classList.add('currencycard__hidden');
      } else {
        currencyCard.classList.remove('currencycard__hidden');
      }
    });
  }

  renderCurrenciesCards() {
    const currencies = this.db.getCurrencyOption();
    const currencyTemplate: HTMLTemplateElement = document.querySelector('#currencycard')!;
    const currenciesHTML = currencies.map((currency) => {
      const currencyHTML = currencyTemplate.content.cloneNode(true);
      (currencyHTML as HTMLElement).querySelector('.currencycard')!.id = currency.id;
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

    // add currencyCard in wrapper.
    const currenciesCardWrapper = (cloneConvertibleCurrency as HTMLElement).querySelector('.currencycard__wrapper')!;
    const currenciesCard = this.renderCurrenciesCards();
    currenciesCard.forEach((currencyCard) => currenciesCardWrapper.append(currencyCard));

    // initial currency options in HTML code.
    this.setCurrency(undefined, cloneConvertibleCurrency);

    // update amount of currency.
    this.updateCurrencyInput(cloneConvertibleCurrency)
      .catch((error) => console.error(error)); // eslint-disable-line no-console

    this.isRender = true;
    return cloneConvertibleCurrency;
  }
}

export default InputCurrencyModule;
