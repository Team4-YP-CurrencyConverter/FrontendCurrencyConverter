/* eslint-disable no-unused-vars */
import debounce from 'debounce';
import getConversionAmount from '../utils/api/conversionApi.ts';
import type InputCurrencyModule from './inputModule.ts';
import DBModule from './dbModule.ts';

class ConverterModule {
  inputCurrencyModules: InputCurrencyModule[];

  db: DBModule;

  constructor(db: DBModule) {
    this.inputCurrencyModules = [];
    this.db = db;
  }

  update(inputCurrencyModule: InputCurrencyModule) {
    // render inputCurrencyModule and add HTML code in converter.
    const currencyInputNode = inputCurrencyModule.render();
    const converterInputs = document.querySelector('#converterInputs')!;
    converterInputs.append(currencyInputNode);
    const currencyInput = converterInputs.lastElementChild!;

    // Find first free currency and initial options in HTML code.
    const currenciesIds = this.db.getCurrencyOption().map((currency) => currency.id);
    const occupiedIds = this.inputCurrencyModules.map((module) => module.currencyId);
    const freeId = currenciesIds.find((id) => !occupiedIds.includes(id))!;
    inputCurrencyModule.setCurrency(freeId);

    // update amount of currency.
    this.updateCurrencyInput(inputCurrencyModule)
      .catch((error) => console.error(error)); // eslint-disable-line no-console

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

    const currencyInputSearch = currencyInput.querySelector('.popup__input');
    currencyInputSearch?.addEventListener(
      'input',
      () => this.handleFilterCurrenciesCards(inputCurrencyModule),
      { signal: inputCurrencyAbortController.signal },
    );

    const currenciesCardWrapper = currencyInput.querySelectorAll('.currencycard');
    currenciesCardWrapper.forEach((currencyCard) => {
      currencyCard.addEventListener('click', () => this._handleSetCurrency(currencyCard.id, inputCurrencyModule));
    });

    // update attributes which indicates that module in converterInputs and active.
    inputCurrencyModule.isRender = true;

    this._toogleConverterButtons();
  }

  _handleAddCurrencyButton() {
    // filter with inputCurrencyModule is not render and update first in CurrenciesBlockModule.
    this.inputCurrencyModules.every((inputCurrencyModule) => {
      if (!inputCurrencyModule.isRender) {
        this.update(inputCurrencyModule);
        return false;
      }
      return true;
    });
  }

  _getOtherInputCurrencyModule(selectedInputCurrencyModule: InputCurrencyModule) {
    // get all inputCurrencyModule, that unselected and rendered.
    return this.inputCurrencyModules.filter(
      (inputCurrencyModule) => (
        inputCurrencyModule !== selectedInputCurrencyModule && inputCurrencyModule.isRender
      ),
    );
  }

  _handleSetCurrency(currencyId: string, selectedInputModule: InputCurrencyModule) {
    /* if other inputModule has currencyId, then the selected module exchanges data with them.
    Otherwise, we send a request to the server to get amount of currency. */
    const otherInputCurrencyModules = this._getOtherInputCurrencyModule(selectedInputModule);
    let isCurrencyNotMatch = true;
    otherInputCurrencyModules.forEach((otherInputCurrencyModule) => {
      if (otherInputCurrencyModule.currencyId === currencyId) {
        const amount = selectedInputModule.amountofCurrency;
        const otherAmount = otherInputCurrencyModule.amountofCurrency;
        otherInputCurrencyModule.setCurrency(selectedInputModule.currencyId);
        otherInputCurrencyModule.updateAmountofCurrency(amount);
        selectedInputModule.setCurrency(currencyId);
        selectedInputModule.updateAmountofCurrency(otherAmount);
        isCurrencyNotMatch = false;
      }
    });
    if (isCurrencyNotMatch) {
      selectedInputModule.setCurrency(currencyId);
      this.updateCurrencyInput(selectedInputModule)
        .catch((error) => console.error(error)); // eslint-disable-line no-console
    }
  }

  _toogleConverterButtons() {
    // hidden and reveal removeButton and addButton, depending on number of InputModules.
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
    /* initialization debounce when render inputModule. After pressing any button,
    validation input text, add loading banner to other inputModules and return debounce promise */
    const selectedInput = document.querySelector(`#${selectedInputModule.name}`)!.querySelector('.converter__textinput') as HTMLInputElement;
    const debounced = this._updateCurrenciesInputsDebounce(selectedInputModule);
    return () => {
      selectedInputModule.amountofCurrency = selectedInput.value;
      selectedInputModule.validationInputAmount();
      const otherInputCurrencyModules = this._getOtherInputCurrencyModule(selectedInputModule);
      otherInputCurrencyModules.forEach((unselectedInputModule) => {
        unselectedInputModule.addLoadingBanner();
      });
      new Promise((resolve, reject) => {
        debounced(resolve, reject);
      }).catch((error) => console.error(error)); // eslint-disable-line no-console
    };
  }

  _updateCurrenciesInputsDebounce(selectedInputModule: InputCurrencyModule) {
    // update all other render inputModules with 2 seconds delay.
    const debounced = debounce((
      resolve: (value: unknown) => void,
      reject: (reason?: unknown) => void,
    ) => {
      const otherInputCurrencyModules = this._getOtherInputCurrencyModule(selectedInputModule);
      if (selectedInputModule.inputError) {
        otherInputCurrencyModules.forEach((unselectedInputModule) => {
          unselectedInputModule.removeLoadingBanner();
        });
      } else if (selectedInputModule.amountofCurrency === '0') {
        otherInputCurrencyModules.forEach((unselectedInputModule) => {
          unselectedInputModule.updateAmountofCurrency('0');
        });
      } else if (!selectedInputModule.inputError) {
        // Initialization of a variable that contains all active currencies.
        let currencies = '';
        currencies += this.db.getCurrencyOption(selectedInputModule.currencyId)[0].short_name;
        // currencies += selectedCurrency?.innerHTML as string;
        otherInputCurrencyModules.forEach((unselectedInputModule) => {
          currencies += this.db.getCurrencyOption(unselectedInputModule.currencyId)[0].short_name;
        });
        ConverterModule.updateCurrenciesInputs(
          Number(selectedInputModule.amountofCurrency),
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
    // pull api-request, after that update amount of currency in inputModules.
    const amounts = await getConversionAmount(amount, currencies);
    updatedСurrencies.forEach((inputCurrency, index) => (
      inputCurrency.updateAmountofCurrency(String(amounts[index]))
    ));
  }

  async updateCurrencyInput(selectedInputModule: InputCurrencyModule) {
    // update amount of currency, when only one InputCurrencyModule need to be updated.
    selectedInputModule.addLoadingBanner();
    const sourceInputModule = this.inputCurrencyModules.find((inputModule) => (
      inputModule !== selectedInputModule && inputModule.isRender
    ));
    let amount: number[] = [0];
    if (sourceInputModule) {
      let currencies = '';
      currencies += this.db.getCurrencyOption(sourceInputModule.currencyId)[0].short_name;
      currencies += this.db.getCurrencyOption(selectedInputModule.currencyId)[0].short_name;
      amount = await getConversionAmount(Number(sourceInputModule.amountofCurrency), currencies);
    }
    selectedInputModule.updateAmountofCurrency(String(amount[0]));
    selectedInputModule.removeLoadingBanner();
  }

  handleFilterCurrenciesCards(selectedInputModule: InputCurrencyModule) {
    // update visibility of currenciesCards, depending on popup__input text.
    const currencies = this.db.getCurrencyOption();
    const ConvertibleCurrency = document.querySelector(`#${selectedInputModule.name}`)!;
    const inputFilterTextLC = (ConvertibleCurrency.querySelector('.popup__input') as HTMLInputElement).value.toLowerCase();
    const currenciesIDS = currencies.filter((currency) => (
      !(currency.name.toLowerCase().includes(inputFilterTextLC)
      || currency.short_name.toLowerCase().includes(inputFilterTextLC))
    )).map((filteredCurrency) => filteredCurrency.id);
    selectedInputModule.removingVisibilityCurrenciesCards(currenciesIDS);
  }

  render(inputCurrencyModules: InputCurrencyModule[]) {
    // initialization converterModule and two inputModules and append in converter section.
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
