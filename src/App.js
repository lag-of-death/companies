import React, { Component } from 'react';
import axios from 'axios';

import {
  Container,
  AddedCompanies,
  FoundCompanies,
  AddedCompaniesHeader,
  SearchInput,
  Company,
  SearchCompanyHeader,
  Divider,
  Logo,
  Button,
  CompanyAdder,
} from './styled_components';

const nameAttr = '2. name';
const symbolAttr = '1. symbol';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foundCompanies: [],
      addedCompanies: [],
    };
  }

  searchForCompanyHandler = async ({ target: { value } }) => {
    const searchWithSymbolEndpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`;
    const { data: { bestMatches: companies } } = await axios.get(searchWithSymbolEndpoint);

    if (companies && companies.length) {
      this.setState({
        foundCompanies: companies.sort(
          (prevCompany, nextCompany) => prevCompany.matchScore > nextCompany.matchScore,
        ),
      });
    }
  };

  addCompanyHandler = async (foundCompany) => {
    const name = foundCompany[nameAttr].replace(/(Inc\.)|(L\.P\.)/gm, '');
    const logoEndpoint = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${name}`;
    const { data: companiesWithLogos } = await axios.get(logoEndpoint);

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

      return {
        addedCompanies: addedCompanies.concat(
          notAddedCompaniesNames
            .map(
              notAddedCompanyName => uniqCompanies.find(({ name }) => name === notAddedCompanyName),
            ).filter(val => val),
        ),
      };
    });
  };

  removeCompanyHandler = (company) => {
    const isRemovingConfirmed = window.confirm('Are you sure to remove?');

    if (isRemovingConfirmed) {
      this.setState(({ addedCompanies }) => ({
        addedCompanies: addedCompanies.filter(
          addedCompany => addedCompany.name !== company.name,
        ),
      }));
    }
  };

  static renderCompanies(companies, getComponent = () => null) {
    return (
      companies.map((company, companyIdx) => {
        const { [symbolAttr]: symbol } = company;
        const companyName = company.name || company[nameAttr];

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
        </CompanyAdder>
        <Divider />
        <AddedCompanies>
          <AddedCompaniesHeader>
          ADDED COMPANIES
          </AddedCompaniesHeader>
          {
          App.renderCompanies(
            state.addedCompanies,
            company => (
              <React.Fragment>
                <Logo>
                  <img alt={company.logo} src={company.logo} />
                </Logo>

                <Button onClick={() => this.removeCompanyHandler(company)}>X</Button>
              </React.Fragment>
            ),
          )
        }
        </AddedCompanies>
      </Container>
    );
  }
}

export default App;
