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
      inputCurrencyModule.handleInputDebounce(),
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
      currencyCard.addEventListener('click', () => inputCurrencyModule.setCurrency(currencyCard.id));
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
