/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-undef */
type Data = {
    id: number;
    link: string;
    name: string;
    description: string;
}
export const cardContainers = document.querySelectorAll('.currencycard__wrapper');

const currencyCardRenderer = (data: Data, item: Element) => {
  const cardTemplate = document.querySelector('#currencycard').content;
  const cardElement = cardTemplate?.querySelector('.currencycard').cloneNode(true);
  cardElement.querySelector('.currencycard__flag').src = data.link;
  cardElement.querySelector('.currencycard__name').textContent = data.name;
  cardElement.querySelector('.currencycard__description').textContent = data.description;
  item?.append(cardElement);
};

export default currencyCardRenderer;
