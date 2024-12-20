import './index.css';
import getCurrencies from './utils/api/currenciesApi.ts';
import handleSelectButton from './utils/handlers/selectbutton.ts';

const data = await getCurrencies();
// eslint-disable-next-line no-console
console.log(data);
handleSelectButton();
