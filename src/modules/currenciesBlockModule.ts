class currenciesBlockModule {
  static update(inputModule: HTMLElement) {
    const converterInputs = document.querySelector('#converterInputs');
    converterInputs?.append(inputModule);
  }

  static toogleAddButton() {
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
}

export default currenciesBlockModule;
