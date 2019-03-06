import axios from 'axios';

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

const getData = async (name, foundCompanyName) => {
  const logoEndpoint = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${name}`;
  const { data: companiesWithLogos } = await axios.get(logoEndpoint);

  const quoteEndpoint = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${foundCompanyName}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`;
  const { data: quoteData } = await axios.get(quoteEndpoint);

  return {
    companiesWithLogos,
    quoteData,
  };
};

const simplifyName = name => name.replace(/(Inc\.)|(L\.P\.)|(Ltd\.)/gm, '');

const getDifference = (arr1, arr2) => {
  const uniqCompaniesNames = arr1.map(toName);
  const addedCompaniesNames = arr2.map(toName);

  return uniqCompaniesNames
    .filter(x => !addedCompaniesNames.includes(x))
    .concat(addedCompaniesNames.filter(x => !uniqCompaniesNames.includes(x)));
};

const getUniqCompanies = possiblyNotAddedCompanies => possiblyNotAddedCompanies.reduce(
  (companies, currentCompany) => (
    companies.find(comp => comp.name === currentCompany.name)
      ? companies
      : companies.concat(currentCompany)
  ),
  [],
);

export {
  getPriceInfo, getData, simplifyName, getDifference, getUniqCompanies,
};
