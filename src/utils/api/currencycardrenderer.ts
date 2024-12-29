type Data = {
    id: number;
    flag: string;
    short_name: string;
    name: string;
    symbol: string;
}
export const cardContainers = document.querySelectorAll('.currencycard__wrapper');

const currencyCardRenderer = (data: Data, item: Element) => {
  const element = document.querySelector('#currencycard') as HTMLTemplateElement;
  const cardTemplate = element.content;
  const cardElement = cardTemplate?.querySelector('.currencycard')!.cloneNode(true);
  (<HTMLImageElement>(cardElement as HTMLElement).querySelector('.currencycard__flag')).src = data.flag;
  (cardElement as HTMLElement).querySelector('.currencycard__name')!.textContent = data.short_name;
  (cardElement as HTMLElement).querySelector('.currencycard__description')!.textContent = data.name;
  item?.append(cardElement);
};

export default currencyCardRenderer;
