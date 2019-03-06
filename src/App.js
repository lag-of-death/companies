import React, { Component } from 'react';
import axios from 'axios';
import { AddedCompanies, FoundCompanies } from './components';

import {
  Container,
  AddedCompaniesContainer,
  FoundCompaniesContainer,
  Header,
  SearchInput,
  Divider,
  CompanyAdder,
} from './styled_components';

import {
  getData, simplifyName, getDifference, getUniqCompanies, byMatchScore, fromNamesToCompanies,
} from './helpers';

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
        foundCompanies: companies.sort(byMatchScore),
      });
    }
  };

  addCompanyHandler = async (foundCompany) => {
    this.setState({
      progress: ADDING,
    });

    const name = simplifyName(foundCompany[nameAttr]);

    const { companiesWithLogos, quoteData } = await getData(name, foundCompany[symbolAttr]);
    const notAddedUniqCompanies = getUniqCompanies(companiesWithLogos, foundCompany[nameAttr]);

    this.setState(({ addedCompanies }) => {
      const notAddedCompaniesNames = getDifference(notAddedUniqCompanies, addedCompanies);
      const notAddedCompanies = notAddedCompaniesNames.reduce(
        fromNamesToCompanies(notAddedUniqCompanies, foundCompany, quoteData),
        [],
      );

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

  render() {
    const { state } = this;

    return (
      <Container>
        <CompanyAdder>
          <Header>
            SEARCH
          </Header>
          <SearchInput placeholder="provide a symbol" onChange={this.searchForCompanyHandler} />
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
