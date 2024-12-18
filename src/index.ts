import './index.css';
import getCurrencies from './utils/api/currenciesApi.ts';

const data = await getCurrencies();
console.log(data);
