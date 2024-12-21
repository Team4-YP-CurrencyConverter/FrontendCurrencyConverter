/* eslint-disable no-undef */
type Data = {
    id: number;
    link: string;
    name: string;
    description: string;
}
export const cardContainers = document.querySelectorAll('.currencycard__wrapper');

const currencyCardRenderer = (data: Data, item: Element) => {
  const element = document.querySelector('#currencycard') as HTMLTemplateElement;
  const cardTemplate = element.content;
  const cardElement = cardTemplate?.querySelector('.currencycard')!.cloneNode(true);
  (<HTMLImageElement>(cardElement as HTMLElement).querySelector('.currencycard__flag')).src = data.link;
  (cardElement as HTMLElement).querySelector('.currencycard__name')!.textContent = data.name;
  (cardElement as HTMLElement).querySelector('.currencycard__description')!.textContent = data.description;
  item?.append(cardElement);
};

export default currencyCardRenderer;
