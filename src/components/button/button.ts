/* eslint-disable no-undef */

import Popup from '../popup/popup.ts';

type Item = {
    link: string;
    name: string;
    description: string;
  }
export default class CurrencyButton extends Popup {
  constructor(selector: string, { data }: Item) {
    super(selector, { data });
  }

  createButton() {
    const btn = document.createElement('BUTTON');
    btn.id = 'btn-id';
    btn.onclick = this.clickButton;
    const btnContainer = document.querySelector('#btn-container');
    if (btnContainer) {
      btnContainer.appendChild(btn);
    }
    this.createButtonText();
    this.createButtonArrow();
    this.createPopup();
    this.getElement();
  }

  createButtonText() {
    const textContainer = document.createElement('div');
    textContainer.id = 'textContainer-id';
    const btnContainer = document.querySelector('#btn-id');
    if (btnContainer) {
      btnContainer.appendChild(textContainer);
    }
    this.createCurrencyFlag();
    this.createCurrencyName();
  }

  createCurrencyName() {
    const name = document.createElement('SPAN');
    const textContainer = document.querySelector('#textContainer-id');
    name.className = 'text';
    name.innerHTML = 'USD';
    if (textContainer) {
      textContainer.appendChild(name);
    }
  }

  createCurrencyFlag() {
    const flag = document.createElement('img');
    flag.src = 'https://yastatic.net/s3/frontend/country-flag/_/2FHekp7b.svg';
    flag.alt = 'флаг США';
    flag.className = 'flag';
    const textContainer = document.querySelector('#textContainer-id');
    if (textContainer) {
      textContainer.appendChild(flag);
    }
  }

  createButtonArrow() {
    const arrow = document.createElement('SPAN');
    const arrowContainer = document.querySelector('#btn-id');
    arrow.className = 'arrow';
    if (arrowContainer) {
      arrowContainer.appendChild(arrow);
    }
  }

  static clickButton() {
    const popup = document.querySelector('.popup');
    popup?.classList.toggle('hidden');
  }
}
