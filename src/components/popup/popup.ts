/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
type Item = {
  link: string;
  name: string;
  description: string;
}

export default class Popup {
  selector: string;

  constructor(selector: string, { data }: Item) {
    this.selector = selector;
    this.link = data.link;
    this.name = data.name;
    this.description = data.description;
  }

  createPopup() {
    const popup = document.createElement('div');
    const popupContainer = document.querySelector('#app');
    popupContainer?.appendChild(popup);
    popup.className = 'popup';
  }

  getElement() {
    const cardElement = document
      .querySelector(this.selector)
      .content
      .querySelector('.card')
      .cloneNode(true);
    console.log(this.link);
    return cardElement;
  }

  generate() {
    const element = this.getElement();
    element.querySelector('.card__image').src = this.link;
    element.querySelector('.card__title').textContent = this.name;
    element.querySelector('.card__image').alt = this._name;
    return element;
  }
}
