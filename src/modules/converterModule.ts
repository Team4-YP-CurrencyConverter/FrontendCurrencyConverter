import type InputCurrencyModule from './inputModule.ts';

class ConverterModule {
  // eslint-disable-next-line class-methods-use-this
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
  }

  _handleAddCurrencyButton(inputCurrencyModules: InputCurrencyModule[]) {
    // filter with inputCurrencyModule is not render and update first in CurrenciesBlockModule
    inputCurrencyModules.every((inputCurrencyModule) => {
      if (!inputCurrencyModule.isRender) {
        this.update(inputCurrencyModule);
        return false;
      }
      return true;
    });
  }

  static toogleAddCurrencyButton() {
    const addButton = document.querySelector('.button');
    addButton?.classList.toggle('button__hidden');
  }

  static visibleRemoveButton() {
    const removeButtons = document.querySelectorAll('.converter__input-toogle');
    removeButtons.forEach((removeButton) => {
      removeButton.classList.remove('.converter__input-toogle-hidden');
    });
  }

  static hiddenRemoveButton() {
    const removeButtons = document.querySelectorAll('.converter__input-toogle');
    removeButtons.forEach((removeButton) => {
      removeButton.classList.add('.converter__input-toogle-hidden');
    });
  }

  render(inputCurrencyModules: InputCurrencyModule[]) {
    const templateConverter: HTMLTemplateElement = document.querySelector('#converter')!;
    const converterNode = templateConverter.content.cloneNode(true);
    const converterSection = document.querySelector('#converterSection')!;
    converterSection.appendChild(converterNode);
    const converter = converterSection.lastElementChild!;
    this.update(inputCurrencyModules[0]);
    this.update(inputCurrencyModules[1]);
    const addButton = converter.querySelector('.button')!;
    addButton.addEventListener('click', () => this._handleAddCurrencyButton(inputCurrencyModules));
  }
}

export default ConverterModule;
