import './index.css';
import getCurrencies from './utils/api/currenciesApi.ts';
import handleAddButton from './utils/handlers/addbutton.ts';
import handleToggleButton from './utils/handlers/closeinputbutton.ts';
import handleSearchCurrency from './utils/handlers/searchcurrency.ts';
import handleSelectButton from './utils/handlers/selectbutton.ts';
import fakedata from './data/fake.ts';
import currencyCardRenderer, { cardContainers } from './utils/api/currencycardrenderer.ts';

const data = await getCurrencies();
// eslint-disable-next-line no-console
console.log(data);
handleSelectButton();
handleAddButton();
handleToggleButton();

fakedata.forEach((item) => {
  currencyCardRenderer(item, cardContainers[0]);
});
fakedata.forEach((item) => {
  currencyCardRenderer(item, cardContainers[1]);
});
fakedata.forEach((item) => {
  currencyCardRenderer(item, cardContainers[2]);
});
fakedata.forEach((item) => {
  currencyCardRenderer(item, cardContainers[3]);
});

handleSearchCurrency();
