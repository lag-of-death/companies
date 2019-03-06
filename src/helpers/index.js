const getPriceInfo = quote => (
  (
    quote && quote['Global Quote'])
    ? {
      price: quote['Global Quote']['05. price'],
      priceChange: quote['Global Quote']['09. change'],
    }
    : {}
);

const toName = ({ name }) => name;

export {
  getPriceInfo, toName,
};
