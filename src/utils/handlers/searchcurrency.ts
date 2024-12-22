/* eslint-disable no-undef */
const handleSearchCurrency = () => {
  const input = document.querySelector('.popup__input');
  const image = document.querySelector('.popup__search-img');
  input?.addEventListener('input', () => {
    if ((<HTMLInputElement>input).value !== '') {
      (<HTMLImageElement>image).src = './src/assets/input-close.svg';
    } else {
      (<HTMLImageElement>image).src = './src/assets/input-search.svg';
    }
    const currenciesTags = input?.closest('.popup')?.querySelectorAll('.currencycard__name');
    const currencies: (string | null)[] = [];
    currenciesTags?.forEach((item) => {
      currencies.push(item.textContent);
      if (!item.textContent?.includes((<HTMLInputElement>input).value)) {
        item.closest('.currencycard')?.classList.add('currencycard__hidden');
        item.closest('.currencycard')?.classList.remove('currencycard__visible');
      } else {
        item.closest('.currencycard')?.classList.remove('currencycard__hidden');
        item.closest('.currencycard')?.classList.add('currencycard__visible');
      }
    });
  });
};

export default handleSearchCurrency;
