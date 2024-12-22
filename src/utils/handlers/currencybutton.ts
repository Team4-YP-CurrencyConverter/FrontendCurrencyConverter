/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable no-undef */
type Data = {
    id: number;
    link: string;
    name: string;
    description: string;
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
            const selectedCurrency = data.filter((curr) => curr.name === cardButton!.querySelector('.currencycard__name')!.textContent);
            const { symbol } = selectedCurrency[0];
            (<HTMLElement>e.target!).closest('.converter__input')!.querySelector('.converter__currency-icon')!.textContent = `${symbol}`;
    });
  });
};

export default handleCurrencyButton;
