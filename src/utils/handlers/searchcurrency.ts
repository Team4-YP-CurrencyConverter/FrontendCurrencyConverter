/* eslint-disable no-undef */
const handleSearchCurrency = () => {
  const inputs = document.querySelectorAll('.popup__input');
  inputs.forEach((input) => {
    const image = input.closest('.popup__search')!.querySelector('.popup__search-img');
    input?.addEventListener('input', () => {
      if ((<HTMLInputElement>input).value !== '') {
        (<HTMLImageElement>image).src = './src/assets/input-close.svg';
      } else {
        (<HTMLImageElement>image).src = './src/assets/input-search.svg';
      }
      const currenciesTags = input?.closest('.popup')?.querySelectorAll('.currencycard__name');
      currenciesTags?.forEach((item) => {
        if (!item.textContent?.toLowerCase().includes(
          (<HTMLInputElement>input).value.toLowerCase(),
        )) {
          item.closest('.currencycard')?.classList.add('currencycard__hidden');
          item.closest('.currencycard')?.classList.remove('currencycard__visible');
        } else {
          item.closest('.currencycard')?.classList.remove('currencycard__hidden');
          item.closest('.currencycard')?.classList.add('currencycard__visible');
        }
      });
    });
  });
};

export default handleSearchCurrency;
