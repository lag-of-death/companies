import React, { Component } from 'react';
import axios from 'axios';
import { AddedCompanies, FoundCompanies } from './components';

import {
  Container,
  AddedCompaniesContainer,
  FoundCompaniesContainer,
  Header,
  SearchInput,
  Company,
  Divider,
  CompanyAdder,
} from './styled_components';

import { getPriceInfo, toName } from './helpers';
import {
  NOOP, SEARCHING, ADDING, ADDING_DONE, ALREADY_ADDED, SEARCHING_DONE, nameAttr, symbolAttr,
} from './helpers/constants';

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
      progress: value ? SEARCHING : NOOP,
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

    const possiblyNotAddedCompanies = companiesWithLogos.length ? companiesWithLogos : [{ name: foundCompany[nameAttr], domain: '', logo: '' }];

    const uniqCompanies = possiblyNotAddedCompanies.reduce(
      (companies, currentCompany) => (
        companies.find(comp => comp.name === currentCompany.name)
          ? companies
          : companies.concat(currentCompany)
      ),
      [],
    );

    this.setState(({ addedCompanies }) => {
      const uniqCompaniesNames = uniqCompanies.map(toName);
      const addedCompaniesNames = addedCompanies.map(toName);

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
        progress: notAddedCompanies.length ? ADDING_DONE : ALREADY_ADDED,
        addedCompanies: addedCompanies.concat(notAddedCompanies),
      };
    });
  };

  removeCompanyHandler = (companyName) => {
    const isRemovingConfirmed = window.confirm('Are you sure to remove?');

    if (isRemovingConfirmed) {
      this.setState(({ addedCompanies }) => ({
        progress: NOOP,
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
          <Header>
            SEARCH
          </Header>
          <SearchInput onChange={this.searchForCompanyHandler} />
          <FoundCompaniesContainer>
            <FoundCompanies
              progress={state.progress}
              addCompanyHandler={this.addCompanyHandler}
              foundCompanies={state.foundCompanies}
            />
          </FoundCompaniesContainer>
          <Header>
            { state.progress }
          </Header>
        </CompanyAdder>
        <Divider />
        <AddedCompaniesContainer>
          <Header>
          ADDED COMPANIES
          </Header>
          <AddedCompanies
            addedCompanies={state.addedCompanies}
            removeCompanyHandler={this.removeCompanyHandler}
          />
        </AddedCompaniesContainer>
      </Container>
    );
  }
}

export default App;
