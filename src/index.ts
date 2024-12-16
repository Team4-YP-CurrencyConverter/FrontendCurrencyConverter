import './index.css';
import CurrencyButton from './components/button/button.ts';
import data from './data/fake.ts';

const btn = new CurrencyButton('#card', data);
btn.createButton();
