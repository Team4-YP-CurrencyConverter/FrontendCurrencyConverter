const handleToggleButton = () => {
  const toggleButtons = document.querySelectorAll('.converter__input-toogle');
  toggleButtons.forEach((item) => {
    item.addEventListener('click', () => {
      item.closest('.converter__wrapper-input-toogle')?.classList.add('converter__input_hidden');
      /* ↓↓ появление - скрытие кнопок удаления инпута ↓↓ */
      const inputs = document.querySelectorAll('.converter__input_hidden');
      const toogleButtons = document.querySelectorAll('.converter__input-toogle');
      if (inputs.length > 1) {
        toogleButtons.forEach((it) => {
          it.classList.add('converter__input-toogle-hidden');
        });
      }
      /* ↑↑ появление - скрытие кнопок удаления инпута ↑↑ */
      const addButton = document.querySelector('.button');
      const inp = document.querySelector('.converter__input_hidden');
      if (!inp) {
        addButton?.classList.add('button__hidden');
        addButton?.classList.remove('button__visible');
      } else {
        addButton?.classList.add('button__visible');
        addButton?.classList.remove('button__hidden');
      }
    });
  });
};

export default handleToggleButton;
