import getConversionAmount from '../api/conversionApi.ts';

const handleAddButton = () => {
  const addButton = document.querySelector('.button');

  addButton?.addEventListener('click', () => {
    // eslint-disable-next-line no-void
    void (async () => {
      /* ↓↓ появление - скрытие кнопок удаления инпута ↓↓ */
      const inputs = document.querySelectorAll('.converter__input');
      // This is the first non-hidden currency in converter
      const referenceCurrencyObject = document.querySelector('.converter__wrapper-input-toogle:not(.converter__input_hidden)') as HTMLElement;
      const toogleButtons = document.querySelectorAll('.converter__input-toogle');
      if (inputs.length > 2) {
        toogleButtons.forEach((item) => {
          item.classList.remove('converter__input-toogle-hidden');
        });
      } else if (inputs.length < 3) {
        toogleButtons.forEach((item) => {
          item.classList.add('converter__input-toogle-hidden');
        });
      }
      /* ↑↑ появление - скрытие кнопок удаления инпута ↑↑ */
      const input = document.querySelector('.converter__input_hidden');
      input?.classList.remove('converter__input_hidden');
      const inp = document.querySelector('.converter__input_hidden');
      if (!inp) {
        addButton?.classList.add('button__hidden');
        addButton.classList.remove('button__visible');
      } else {
        addButton?.classList.add('button__visible');
        addButton.classList.remove('button__hidden');
      }

      const referenceCurrencyAmount = (referenceCurrencyObject?.querySelector('.converter__textinput') as HTMLInputElement).value;
      if (referenceCurrencyAmount !== '0' && referenceCurrencyAmount) {
        const selectedCurrencyName = input?.querySelector('.select__text')?.innerHTML as string;
        const referenceCurrencyName = referenceCurrencyObject?.querySelector('.select__text')?.innerHTML;

        const selectedCurrencyAmount = await getConversionAmount(
          Number(referenceCurrencyAmount),
          referenceCurrencyName + selectedCurrencyName,
        );

        const selectedCurrencyInput = input?.querySelector('.converter__textinput') as HTMLInputElement;
        selectedCurrencyInput.value = selectedCurrencyAmount[0].toString();
      }
    })();
  });
};

export default handleAddButton;
