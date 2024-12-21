/* eslint-disable no-undef */
const handleSearchCurrency = () => {
  const input = document.querySelector('.popup__input');
  const image = document.querySelector('.popup__search-img');
  input?.addEventListener('input', () => {
    console.log(image);
    if ((<HTMLInputElement>input).value !== '') {
      (<HTMLImageElement>image).src = './src/assets/input-close.svg';
    } else {
      (<HTMLImageElement>image).src = './src/assets/input-search.svg';
    }
  });
};

export default handleSearchCurrency;
