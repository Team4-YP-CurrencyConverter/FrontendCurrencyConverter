/* eslint-disable no-unused-vars */
import debounce from 'debounce';
import getConversionAmount from '../utils/api/conversionApi.ts';
import { CheckIsValid, schemaCurrencyValue } from '../validation/index.ts';
import type InputCurrencyModule from './inputModule.ts';

class ConverterModule {
  inputCurrencyModules: InputCurrencyModule[];

  constructor() {
    this.inputCurrencyModules = [];
  }

  update(inputCurrencyModule: InputCurrencyModule) {
    // render inputCurrencyModule and add HTML code in converter.
    const currencyInputNode = inputCurrencyModule.render();
    const converterInputs = document.querySelector('#converterInputs')!;
    converterInputs.append(currencyInputNode);
    const currencyInput = converterInputs.lastElementChild!;

    const inputCurrencyAbortController = new AbortController();

    // add request for currency conversion to currency input.
    const selectedInput = currencyInput.querySelector('.converter__textinput')!;
    selectedInput.addEventListener(
      'input',
      this._handleInputDebounce(inputCurrencyModule),
      { signal: inputCurrencyAbortController.signal },
    );

    // add currency HTML code deleting to remove button.
    const removeButton = currencyInput.querySelector('.converter__input-toogle')!;
    removeButton.addEventListener(
      'click',
      () => {
        inputCurrencyModule.remove();
        this._toogleConverterButtons();
        // remove all eventlisteners from inputCurrencyModule.
        inputCurrencyAbortController.abort();
      },
      { signal: inputCurrencyAbortController.signal },
    );

    const selectButton = currencyInput.querySelector('.select')!;
    selectButton.addEventListener('click', () => inputCurrencyModule.openSelect(), { signal: inputCurrencyAbortController.signal });
    const selectOverlay = document.querySelector('.popup__overlay');
    selectOverlay?.addEventListener('click', () => inputCurrencyModule.closeSelect(), { signal: inputCurrencyAbortController.signal });
    document.addEventListener(
      'keyup',
      (event) => {
        if (event.code === 'Escape') {
          inputCurrencyModule.closeSelect();
        }
      },
      { signal: inputCurrencyAbortController.signal },
    );

    const currenciesCardWrapper = currencyInput.querySelectorAll('.currencycard');
    currenciesCardWrapper.forEach((currencyCard) => {
      currencyCard.addEventListener('click', () => this._handleSetCurrency(currencyCard.id, inputCurrencyModule));
    });

    this._toogleConverterButtons();
  }

  _handleAddCurrencyButton() {
    // filter with inputCurrencyModule is not render and update first in CurrenciesBlockModule
    this.inputCurrencyModules.every((inputCurrencyModule) => {
      if (!inputCurrencyModule.isRender) {
        this.update(inputCurrencyModule);
        return false;
      }
      return true;
    });
  }

  _getOtherInputCurrencyModule(selectedInputCurrencyModule: InputCurrencyModule) {
    return this.inputCurrencyModules.filter(
      (inputCurrencyModule) => (
        inputCurrencyModule !== selectedInputCurrencyModule && inputCurrencyModule.isRender
      ),
    );
  }

  _handleSetCurrency(currencyId: string, selectedInputModule: InputCurrencyModule) {
    const otherInputCurrencyModules = this._getOtherInputCurrencyModule(selectedInputModule);
    let isCurrencyNotMatch = true;
    otherInputCurrencyModules.forEach((inputCurrencyModule) => {
      if (inputCurrencyModule.currencyId === currencyId) {
        inputCurrencyModule.setCurrency(selectedInputModule.currencyId);
        selectedInputModule.setCurrency(currencyId);
        isCurrencyNotMatch = false;
      }
    });
    if (isCurrencyNotMatch) {
      selectedInputModule.setCurrency(currencyId);
    }
  }

  _toogleConverterButtons() {
    const inputCurrencyModulesLength = this.inputCurrencyModules.reduce(
      (result, currentModule) => (currentModule.isRender ? result + 1 : result),
      0,
    );
    const addButton = document.querySelector('.button');
    const removeButtons = document.querySelectorAll('.converter__input-toogle');
    if (inputCurrencyModulesLength <= 2) {
      removeButtons.forEach((removeButton) => {
        removeButton.classList.add('converter__input-toogle-hidden');
      });
    } else if (inputCurrencyModulesLength === 3) {
      removeButtons.forEach((removeButton) => {
        removeButton.classList.remove('converter__input-toogle-hidden');
      });
      addButton?.classList.remove('button__hidden');
    } else {
      addButton?.classList.add('button__hidden');
    }
  }

  _handleInputDebounce(selectedInputModule: InputCurrencyModule) {
    const [
      selectedCurrencyInput,
      selectedCurrency,
      selectedCurrencyError,
    ] = selectedInputModule.getInputElements();
    const debounced = this._updateCurrenciesInputsDebounce(
      selectedInputModule,
      selectedCurrencyInput,
      selectedCurrency,
      selectedCurrencyError,
    );
    return () => {
      CheckIsValid(schemaCurrencyValue, selectedCurrencyInput.value, selectedCurrencyError);
      const otherInputCurrencyModules = this._getOtherInputCurrencyModule(selectedInputModule);
      otherInputCurrencyModules.forEach((unselectedInputModule) => {
        unselectedInputModule.addLoadingBanner();
      });
      new Promise((resolve, reject) => {
        debounced(resolve, reject);
      }).catch((error) => console.error(error)); // eslint-disable-line no-console
    };
  }

  _updateCurrenciesInputsDebounce(
    selectedInputModule: InputCurrencyModule,
    selectedCurrencyInput: HTMLInputElement,
    selectedCurrency: Element | null,
    selectedCurrencyError: HTMLSpanElement,
  ) {
    const debounced = debounce((
      resolve: (value: unknown) => void,
      reject: (reason?: unknown) => void,
    ) => {
      const otherInputCurrencyModules = this._getOtherInputCurrencyModule(selectedInputModule);
      if (selectedCurrencyError.innerText) {
        otherInputCurrencyModules.forEach((unselectedInputModule) => {
          unselectedInputModule.removeLoadingBanner();
        });
      } else if (selectedCurrencyInput.value === '0') {
        otherInputCurrencyModules.forEach((unselectedInputModule) => {
          unselectedInputModule.updateAmountofCurrency('0');
        });
      } else if (!selectedCurrencyError.innerText) {
        // Initialization of a variable that contains all active currencies.
        let currencies = '';
        currencies += selectedCurrency?.innerHTML as string;
        otherInputCurrencyModules.forEach((unselectedInputModule) => {
          const unselectedCurrency = document.querySelector(`#${unselectedInputModule.name}`)?.querySelector('.select__text');
          currencies += unselectedCurrency?.innerHTML as string;
        });
        ConverterModule.updateCurrenciesInputs(
          Number(selectedCurrencyInput.value),
          currencies,
          otherInputCurrencyModules,
        ).then(resolve).catch(reject);
      }
    }, 2000);
    return debounced;
  }

  static async updateCurrenciesInputs(
    amount: number,
    currencies: string,
    updatedСurrencies: InputCurrencyModule[],
  ) {
    const amounts = await getConversionAmount(amount, currencies);
    updatedСurrencies.forEach((inputCurrency, index) => (
      inputCurrency.updateAmountofCurrency(String(amounts[index]))
    ));
  }

  render(inputCurrencyModules: InputCurrencyModule[]) {
    const templateConverter: HTMLTemplateElement = document.querySelector('#converter')!;
    const converterNode = templateConverter.content.cloneNode(true);
    const converterSection = document.querySelector('#converterSection')!;
    converterSection.appendChild(converterNode);
    const converter = converterSection.lastElementChild!;
    this.inputCurrencyModules = inputCurrencyModules;
    this.update(this.inputCurrencyModules[0]);
    this.update(this.inputCurrencyModules[1]);
    const addButton = converter.querySelector('.button')!;
    addButton.addEventListener('click', () => this._handleAddCurrencyButton());
  }
}

export default ConverterModule;
