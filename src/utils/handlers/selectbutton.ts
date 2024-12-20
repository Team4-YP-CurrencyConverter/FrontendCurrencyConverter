/* eslint-disable no-undef */
const handleSelectButton = () => {
  const selectButtons = document.querySelectorAll('.select');
  selectButtons.forEach((selectButton) => {
    selectButton.addEventListener('click', () => {
      const img = selectButton.querySelector('.select__arrow');
      img?.classList.toggle('select__arrow-rotated');
      const popup = selectButton.closest('.converter__input')?.querySelector('.popup');
      popup?.classList.toggle('popup__hidden');
      const popups = document.querySelectorAll('.popup');
      popups.forEach((item) => {
        if (item !== popup) {
          item.classList.add('popup__hidden');
        }
        document.addEventListener('keydown', (evt) => {
          if (evt.key === 'Escape') {
            item.classList.add('popup__hidden');
            const images = document.querySelectorAll('.select__arrow');
            images.forEach((image) => {
              image.classList.remove('select__arrow-rotated');
            });
          }
        });
        if (!item.classList.contains('.popup__hidden')) {
          document.addEventListener('click', (e) => {
            console.log(e.target);
            /* if (e.target !== item && !item.contains(e.target)) {
              item.classList.add('popup__hidden');
            } */
          });
        }
      });
      const images = document.querySelectorAll('.select__arrow');
      images.forEach((item) => {
        if (item !== img) {
          item.classList.remove('select__arrow-rotated');
        }
      });
    });
  });
};
export default handleSelectButton;
