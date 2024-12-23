import './index.css';
import handleAddButton from './utils/handlers/addbutton.ts';
import handleToggleButton from './utils/handlers/closeinputbutton.ts';
import handleSearchCurrency from './utils/handlers/searchcurrency.ts';
import handleSelectButton from './utils/handlers/selectbutton.ts';
import fakedata from './data/fake.ts';
import currencyCardRenderer, { cardContainers } from './utils/api/currencycardrenderer.ts';
import handleCurrencyButton from './utils/handlers/currencybutton.ts';

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

handleCurrencyButton(fakedata);
