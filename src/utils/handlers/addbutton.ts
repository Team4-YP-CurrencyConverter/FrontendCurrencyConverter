/* eslint-disable no-undef */
const handleAddButton = () => {
  const addButton = document.querySelector('.button');

  addButton?.addEventListener('click', () => {
    /* ↓↓ появление - скрытие кнопок удаления инпута ↓↓ */
    const inputs = document.querySelectorAll('.converter__input');
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
  });
};

export default handleAddButton;
