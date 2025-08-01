import { CheckIsValid, schemaCurrencyValue } from '../utils/validation/index.ts';
import type DBModule from './dbModule.ts';

class InputCurrencyModule {
  name: string;

  isRender: boolean;

  amountofCurrency: string;

  currencyId: string;

  inputError: string | null;

  db: DBModule;

  constructor(name: string, db: DBModule) {
    this.name = name;
    this.isRender = false;
    this.amountofCurrency = '0';
    this.currencyId = '-1';
    this.inputError = '';
    this.db = db;
  }

  remove() {
    // Remove a currencie block from converter.
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    convertibleCurrency.remove();
    this.isRender = false;
  }

  validationInputAmount() {
    const inputError = document.querySelector(`#${this.name}`)!.querySelector('.error') as HTMLSpanElement;
    CheckIsValid(schemaCurrencyValue, String(this.amountofCurrency), inputError);
    this.inputError = inputError.textContent;
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
    this.amountofCurrency = amountofCurrency;
    this.validationInputAmount();
    this.removeLoadingBanner();
  }

  setCurrency(currencyId: string) {
    // Change currency in selected currency block.
    this.currencyId = currencyId;
    const convertibleCurrency = document.querySelector(`#${this.name}`)!;
    const currency = this.db.getCurrencyOption(this.currencyId)[0];
    const currencyIcon = convertibleCurrency.querySelector('.converter__currency-icon')!;
    currencyIcon.innerHTML = currency.symbol;
    const currencyFlag = convertibleCurrency.querySelector('.select__flag') as HTMLImageElement;
    currencyFlag.src = currency.flag;
    const currencyName = convertibleCurrency.querySelector('.select__text')!;
    currencyName.textContent = currency.short_name;
    this.removingVisibilityCurrenciesCards();
    this.closeSelect();
  }

  removingVisibilityCurrenciesCards(ids?: string[]) {
    // Hidden currencies cards matching with selected currency or by id`s.
    const currenciesCards = document.querySelector(`#${this.name}`)!.querySelectorAll('.currencycard');
    currenciesCards.forEach((currencyCard) => {
      let conditionCardsVisibility;
      if (ids) {
        conditionCardsVisibility = (
          ids.includes(currencyCard.id)
          || currencyCard.id === this.currencyId
        );
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
    // return HTML-code initialization currencies cards.
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

    return cloneConvertibleCurrency;
  }
}

export default InputCurrencyModule;
