import './index.css';
import getCurrencies from './utils/api/currenciesApi.ts';
import handleAddButton from './utils/handlers/addbutton.ts';
import handleToggleButton from './utils/handlers/closeinputbutton.ts';
import handleSearchCurrency from './utils/handlers/searchcurrency.ts';
import handleSelectButton from './utils/handlers/selectbutton.ts';

const data = await getCurrencies();
// eslint-disable-next-line no-console
console.log(data);
handleSelectButton();
handleAddButton();
handleToggleButton();
handleSearchCurrency();
