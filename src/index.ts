/* eslint-disable no-console */
import './index.css';
import getConversionAmount from './utils/api/conversionApi.ts';
import getCurrencies from './utils/api/currenciesApi.ts';
import handleAddButton from './utils/handlers/addbutton.ts';
import handleToggleButton from './utils/handlers/closeinputbutton.ts';
import handleSelectButton from './utils/handlers/selectbutton.ts';

// todo: delete all api fetch
const currenciesData = await getCurrencies();
console.log(currenciesData);
const firstConversionData = await getConversionAmount(1000, 'RUBUSD');
console.log(firstConversionData);
const secondConversionData = await getConversionAmount(5, 'EURRUBTRY');
console.log(secondConversionData);
const thirdConversionData = await getConversionAmount(10, 'GBPEURRUBCNY');
console.log(thirdConversionData);
handleSelectButton();
handleAddButton();
handleToggleButton();
