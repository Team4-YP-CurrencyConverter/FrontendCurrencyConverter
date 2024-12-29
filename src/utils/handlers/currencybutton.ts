/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import getConversionAmount from '../api/conversionApi.ts';

/* eslint-disable no-undef */
type Data = {
    id: number;
    flag: string;
    short_name: string;
    name: string;
    symbol: string;
}

const handleCurrencyButton = (data: Data[]) => {
  const cardButtons = document.querySelectorAll('.currencycard');
  cardButtons.forEach((item) => {
    item.addEventListener('click', (e) => {
      // eslint-disable-next-line no-void
      void (async () => {
        const selectButton = (<HTMLElement>e.target!).closest('.converter__input')!.querySelector('.select');
        const rememberedText = selectButton!.querySelector('.select__text')!.textContent;
        const rememberedFlag = (<HTMLImageElement>selectButton!.querySelector('.select__flag')!).src;
        const rememberedIcon = (<HTMLElement>e.target!).closest('.converter__input')!.querySelector('.converter__currency-icon')!.textContent;
        /* ↑↑ запоминаем значения в кнопке до изменения ↑↑ */
        const cardButton = (<HTMLElement>e.target!).closest('.currencycard');

        // Initialization of variables of the new and old short name selected currency
        const oldCurrencyName = selectButton!.querySelector('.select__text')!.textContent as string;
        const newCurrencyName = cardButton!.querySelector('.currencycard__name')!.textContent as string;
        (<HTMLImageElement>selectButton!.querySelector('.select__flag')!).src = (<HTMLImageElement>cardButton!.querySelector('.currencycard__flag')!).src;
        selectButton!.querySelector('.select__text')!.textContent = newCurrencyName;
        const popup = (<HTMLElement>e.target!).closest('.popup');
        const overlay = document.querySelector('.popup__overlay');
        overlay?.classList.toggle('popup__overlay-hidden');
        popup?.classList.add('popup__hidden');
        popup?.classList.remove('popup__visible');
        (<HTMLImageElement>selectButton!.querySelector('.select__arrow')!).classList.remove('select__arrow-rotated');
        const selectedCurrency = data.filter((curr) => curr.short_name === newCurrencyName);
        (<HTMLElement>e.target!).closest('.converter__input')!.querySelector('.converter__currency-icon')!.remove();
        const { symbol } = selectedCurrency[0];
        const span = document.createElement('span');
        span.className = 'converter__currency-icon';
        span.innerHTML = symbol;

        // Initialization a variable of the selected currency input
        const selectedCurrencyObject = (<HTMLElement>e.target!).closest('.converter__input')!.querySelector('.converter__data-container');
        const selectedCurrencyInput = selectedCurrencyObject?.querySelector('.converter__textinput') as HTMLInputElement;
        const oldCurrencyValue = selectedCurrencyInput.value;

        // get new currency amount
        const newAmounts = await getConversionAmount(
          Number(oldCurrencyValue),
          oldCurrencyName + newCurrencyName,
        );

        // update amounts and symbol of selected currency
        selectedCurrencyInput.value = newAmounts.toString();
        selectedCurrencyObject!.prepend(span);

        /* проверка на повтор валюты */
        const selectBtnsToCheckDuplicates = Array.from(document.querySelectorAll('.select')).filter(((btn) => btn !== selectButton));
        selectBtnsToCheckDuplicates.forEach((btnToCheck) => {
          if (btnToCheck.querySelector('.select__text')?.textContent?.toUpperCase() === selectButton!.querySelector('.select__text')!.textContent!.toUpperCase()) {
            btnToCheck.querySelector('.select__text')!.textContent = rememberedText;
            (<HTMLImageElement>btnToCheck!.querySelector('.select__flag')!).src = rememberedFlag;
            btnToCheck!.closest('.converter__input')!.querySelector('.converter__currency-icon')!.textContent = rememberedIcon;
            (btnToCheck!.closest('.converter__input')?.querySelector('.converter__textinput') as HTMLInputElement).value = oldCurrencyValue;
          }
        });
      })();
    });
  });
};

export default handleCurrencyButton;
