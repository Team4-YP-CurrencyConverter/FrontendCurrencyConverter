import './index.css';
import ConverterModule from './modules/converterModule.ts';
import DBModule from './modules/dbModule.ts';
import InputCurrencyModule from './modules/inputModule.ts';
import getCurrencies from './utils/api/currenciesApi.ts';

const db = new DBModule();

const startCurrencies = await getCurrencies();

startCurrencies.forEach((currency) => {
  db.addCurrencies(currency);
});

const converter = new ConverterModule(db);
const firstCurrencyInput = new InputCurrencyModule('firstСonvertibleCurrency', db);
const secondCurrencyInput = new InputCurrencyModule('secondConvertibleCurrency', db);
const thirdCurrencyInput = new InputCurrencyModule('thirdConvertibleCurrency', db);
const fourthCurrencyInput = new InputCurrencyModule('fourthСonvertibleCurrency', db);

const currencyInputs = [
  firstCurrencyInput,
  secondCurrencyInput,
  thirdCurrencyInput,
  fourthCurrencyInput,
];

converter.render(currencyInputs);

export default startCurrencies;
