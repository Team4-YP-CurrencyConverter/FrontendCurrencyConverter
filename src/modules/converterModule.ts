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
    converterInputs.appendChild(currencyInputNode);
    const currencyInput = converterInputs.lastElementChild!;

    // add id to converter__wrapper-input-toogle.
    currencyInput.setAttribute('id', inputCurrencyModule.name);

    // initial currency options in HTML code.
    inputCurrencyModule.setCurrence();

    // add request for currency conversion to currency input.
    const selectedInput = currencyInput.querySelector('.converter__textinput')!;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    selectedInput.addEventListener('input', inputCurrencyModule.handleInputDebounce());

    // add currency HTML code deleting to remove button.
    const removeButton = currencyInput.querySelector('.converter__input-toogle')!;
    removeButton.addEventListener('click', () => inputCurrencyModule.remove());

    // update amount of currency.
    inputCurrencyModule.updateCurrencyInput()
      .catch((error) => console.error(error)); // eslint-disable-line no-console
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
