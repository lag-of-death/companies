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
  const quoteEndpoint = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${foundCompanyName}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`;

  const [companiesWithLogos, quoteData] = await Promise.all([
    axios.get(logoEndpoint),
    axios.get(quoteEndpoint),
  ]);

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

const getPossiblyNotAddedCompanies = (companiesWithLogos, name) => (
  companiesWithLogos.length
    ? companiesWithLogos
    : [{ name, domain: '', logo: '' }]
);

const getUniqCompanies = (companiesWithLogos, companyName) => {
  const possiblyNotAddedCompanies = getPossiblyNotAddedCompanies(
    companiesWithLogos,
    companyName,
  );

  return possiblyNotAddedCompanies.reduce(
    (companies, currentCompany) => (
      companies.find(comp => comp.name === currentCompany.name)
        ? companies
        : companies.concat(currentCompany)
    ),
    [],
  );
};

const fromNamesToCompanies = (
  notAddedUniqCompanies,
  foundCompany,
  quoteData,
) => (acc, notAddedCompanyName) => {
  const company = notAddedUniqCompanies.find(({ name }) => name === notAddedCompanyName);

  return company
    ? acc.concat(Object.assign({}, company, foundCompany, getPriceInfo(quoteData)))
    : acc;
};

const byMatchScore = (prevCompany, nextCompany) => prevCompany.matchScore > nextCompany.matchScore;

export {
  getPriceInfo,
  getData,
  simplifyName,
  getDifference,
  getUniqCompanies,
  byMatchScore,
  fromNamesToCompanies,
};
