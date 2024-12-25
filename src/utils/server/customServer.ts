// eslint-disable-next-line import/no-extraneous-dependencies
import jsonServer from 'json-server';
import db from './db.json';

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();
server.use(middlewares);

server.get('/conversion', (req, res) => {
  const responseBody: number[] = [];
  let [firstCurrency, secondCurrency, thirdCurrency, fourthCurrency] = ['', '', '', ''];
  let conversionRate = {};
  // Get url parameters
  const params = new URLSearchParams(req.url);
  const [amount, currencies] = [Number(params.get('amount')), params.get('currencies')];
  // Parsing currencies
  if (amount && currencies) {
    [firstCurrency, secondCurrency, thirdCurrency, fourthCurrency] = [
      currencies.substring(0, 3),
      currencies.substring(3, 6),
      currencies.substring(6, 9),
      currencies.substring(9),
    ];
  } else {
    res.statusCode = 500;
  }
  // Get conversion rate
  if (firstCurrency in db.conversion_rate) {
    conversionRate = db.conversion_rate[firstCurrency as keyof typeof db.conversion_rate];
  } else {
    res.statusCode = 500;
  }
  // Get amount of first currency
  if (secondCurrency in conversionRate) {
    responseBody.push(
      Number(
        (Number(amount) / conversionRate[secondCurrency as keyof typeof conversionRate]).toFixed(4),
      ),
    );
  } else {
    res.statusCode = 500;
  }
  // Get amount of second currency, if it exists
  if (thirdCurrency in conversionRate) {
    responseBody.push(
      Number(
        (Number(amount) / conversionRate[thirdCurrency as keyof typeof conversionRate]).toFixed(4),
      ),
    );
  }
  // Get amount of third currency, if it exists
  if (fourthCurrency in conversionRate) {
    responseBody.push(
      Number(
        (Number(amount) / conversionRate[fourthCurrency as keyof typeof conversionRate]).toFixed(4),
      ),
    );
  }
  res.jsonp(responseBody);
});

server.use(router);
server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Custom JSON Server is running');
});
