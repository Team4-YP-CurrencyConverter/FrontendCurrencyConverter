/* eslint-disable no-undef */
const handleSelectButton = () => {
  const selectButtons = document.querySelectorAll('.select');
  selectButtons.forEach((selectButton) => {
    selectButton.addEventListener('click', () => {
      const img = selectButton.querySelector('.select__arrow');
      img?.classList.toggle('select__arrow-rotated');
      const overlay = document.querySelector('.popup__overlay');
      overlay?.classList.toggle('popup__overlay-hidden');
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
        document.addEventListener('click', (e) => {
          if (e.target === overlay) {
            item.classList.add('popup__hidden');
            const images = document.querySelectorAll('.select__arrow');
            images.forEach((image) => {
              image.classList.remove('select__arrow-rotated');
            });
            overlay?.classList.add('popup__overlay-hidden');
          }
        });
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
