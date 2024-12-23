/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
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
      const selectButton = (<HTMLElement>e.target!).closest('.converter__input')!.querySelector('.select');
      const cardButton = (<HTMLElement>e.target!).closest('.currencycard');
      (<HTMLImageElement>selectButton!.querySelector('.select__flag')!).src = (<HTMLImageElement>cardButton!.querySelector('.currencycard__flag')!).src;
            selectButton!.querySelector('.select__text')!.textContent = cardButton!.querySelector('.currencycard__name')!.textContent;
            const popup = (<HTMLElement>e.target!).closest('.popup');
            const overlay = document.querySelector('.popup__overlay');
            overlay?.classList.toggle('popup__overlay-hidden');
            popup?.classList.add('popup__hidden');
            popup?.classList.remove('popup__visible');
            (<HTMLImageElement>selectButton!.querySelector('.select__arrow')!).classList.remove('select__arrow-rotated');
            const selectedCurrency = data.filter((curr) => curr.short_name === cardButton!.querySelector('.currencycard__name')!.textContent);
            (<HTMLElement>e.target!).closest('.converter__input')!.querySelector('.converter__currency-icon')!.remove();
            const { symbol } = selectedCurrency[0];
            const span = document.createElement('span');
            span.className = 'converter__currency-icon';
            span.innerHTML = symbol;
            (<HTMLElement>e.target!).closest('.converter__input')!.querySelector('.converter__data-container')!.prepend(span);
    });
  });
};

export default handleCurrencyButton;
