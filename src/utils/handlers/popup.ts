/* eslint-disable no-undef */
const handlePopup = () => {
  const popups = document.querySelectorAll('.popup');
  popups.forEach((item) => {
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        item.classList.add('popup__hidden');
      }
    });
  });
};

export default handlePopup;
