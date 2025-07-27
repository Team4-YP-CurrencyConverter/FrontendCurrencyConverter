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

// Get first 4 Currencies id`s.
const currenciesId = db.getCurrencyOption().slice(0, 4).map((currency) => currency.id);

const converter = new ConverterModule(db);
const firstCurrencyInput = new InputCurrencyModule('firstСonvertibleCurrency', currenciesId[0], db);
const secondCurrencyInput = new InputCurrencyModule('secondConvertibleCurrency', currenciesId[1], db);
const thirdCurrencyInput = new InputCurrencyModule('thirdConvertibleCurrency', currenciesId[2], db);
const fourthCurrencyInput = new InputCurrencyModule('fourthСonvertibleCurrency', currenciesId[3], db);

const currencyInputs = [
  firstCurrencyInput,
  secondCurrencyInput,
  thirdCurrencyInput,
  fourthCurrencyInput,
];

converter.render(currencyInputs);

export default startCurrencies;
