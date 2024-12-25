import getCurrencies from '../utils/api/currenciesApi.ts';
import currencyCardRenderer, { cardContainers } from '../utils/api/currencycardrenderer.ts';
import handleCurrencyButton from '../utils/handlers/currencybutton.ts';

async function mainInitialization() {
  const startData = await getCurrencies();

  if (startData) {
    startData.forEach((item) => {
      currencyCardRenderer(item, cardContainers[0]);
    });
    startData.forEach((item) => {
      currencyCardRenderer(item, cardContainers[1]);
    });
    startData.forEach((item) => {
      currencyCardRenderer(item, cardContainers[2]);
    });
    startData.forEach((item) => {
      currencyCardRenderer(item, cardContainers[3]);
    });
    handleCurrencyButton(startData);
  }
}

export default mainInitialization;
