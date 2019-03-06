import React, { Component } from 'react';
import axios from 'axios';
import FoundCompanyDataViewer from './components';

import {
  Container,
  AddedCompanies,
  FoundCompanies,
  AddedCompaniesHeader,
  SearchInput,
  Company,
  SearchCompanyHeader,
  Divider,
  Button,
  CompanyAdder,
} from './styled_components';

const NOOP = 'NOOP';
const SEARCHING = 'SEARCHING';
const SEARCHING_DONE = 'SEARCHING_DONE';
const ADDING = 'ADDING';
const ADDING_DONE = 'ADDING_DONE';
const NOT_FOUND = 'NOT_FOUND';

const nameAttr = '2. name';
const symbolAttr = '1. symbol';

const getPriceInfo = quote => (
  (
    quote && quote['Global Quote'])
    ? {
      price: quote['Global Quote']['05. price'],
      priceChange: quote['Global Quote']['09. change'],
    }
    : {}
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: NOOP,
      foundCompanies: [],
      addedCompanies: [],
    };
  }

  searchForCompanyHandler = async ({ target: { value } }) => {
    this.setState({
      progress: SEARCHING,
    });

    const searchWithSymbolEndpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`;
    const { data: { bestMatches: companies } } = await axios.get(searchWithSymbolEndpoint);

    if (companies && companies.length) {
      this.setState({
        progress: SEARCHING_DONE,
        foundCompanies: companies.sort(
          (prevCompany, nextCompany) => prevCompany.matchScore > nextCompany.matchScore,
        ),
      });
    }
  };

  addCompanyHandler = async (foundCompany) => {
    this.setState({
      progress: ADDING,
    });

    const name = foundCompany[nameAttr].replace(/(Inc\.)|(L\.P\.)|(Ltd\.)/gm, '');

    const logoEndpoint = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${name}`;
    const { data: companiesWithLogos } = await axios.get(logoEndpoint);

    const quoteEndpoint = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${foundCompany[symbolAttr]}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`;
    const { data: quoteData } = await axios.get(quoteEndpoint);

    const uniqCompanies = companiesWithLogos.reduce(
      (companies, currentCompany) => (
        companies.find(comp => comp.name === currentCompany.name)
          ? companies
          : companies.concat(currentCompany)
      ),
      [],
    );

    this.setState(({ addedCompanies }) => {
      const uniqCompaniesNames = uniqCompanies.map(({ name }) => name);
      const addedCompaniesNames = addedCompanies.map(({ name }) => name);

      const notAddedCompaniesNames = uniqCompaniesNames
        .filter(x => !addedCompaniesNames.includes(x))
        .concat(addedCompaniesNames.filter(x => !uniqCompaniesNames.includes(x)));

      const notAddedCompanies = notAddedCompaniesNames.reduce((acc, notAddedCompanyName) => {
        const company = uniqCompanies.find(({ name }) => name === notAddedCompanyName);

        return company
          ? acc.concat(Object.assign({}, company, foundCompany, getPriceInfo(quoteData)))
          : acc;
      }, []);

      return {
        progress: notAddedCompanies.length ? ADDING_DONE : NOT_FOUND,
        addedCompanies: addedCompanies.concat(notAddedCompanies),
      };
    });
  };

  removeCompanyHandler = (companyName) => {
    const isRemovingConfirmed = window.confirm('Are you sure to remove?');

    if (isRemovingConfirmed) {
      this.setState(({ addedCompanies }) => ({
        addedCompanies: addedCompanies.filter(
          addedCompany => addedCompany.name !== companyName,
        ),
      }));
    }
  };

  static renderCompanies(companies, getComponent = () => null) {
    return (
      companies.map((company, companyIdx) => {
        const { [symbolAttr]: symbol, [nameAttr]: companyName } = company;

        return (
          <Company key={`${companyName}:${symbol}:${companyIdx}`}>
            <div style={{ width: '40%' }}>
              { companyName }
            </div>
            { getComponent(company) }
          </Company>
        );
      })
    );
  }

  render() {
    const { state } = this;

    return (
      <Container>
        <CompanyAdder>
          <SearchCompanyHeader>
            SEARCH
          </SearchCompanyHeader>
          <SearchInput onChange={this.searchForCompanyHandler} />
          <FoundCompanies>
            {
            App.renderCompanies(
              state.foundCompanies,
              company => <Button onClick={() => this.addCompanyHandler(company)}>add</Button>,
            )
          }
          </FoundCompanies>
          <div>
            { state.progress }
          </div>
        </CompanyAdder>
        <Divider />
        <AddedCompanies>
          <AddedCompaniesHeader>
          ADDED COMPANIES
          </AddedCompaniesHeader>
          {
            state.addedCompanies.map(
              addedCompany => (
                <Company key={addedCompany.name}>
                  <FoundCompanyDataViewer
                    marketOpen={addedCompany['5. marketOpen']}
                    marketClose={addedCompany['6. marketClose']}
                    removeCompanyHandler={this.removeCompanyHandler}
                    {...addedCompany}
                  />
                </Company>
              ),
            )
          }
        </AddedCompanies>
      </Container>
    );
  }
}

export default App;
