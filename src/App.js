import React, { Component } from 'react';
import axios from 'axios';
import { AddedCompanies, FoundCompanies } from './components';
import Modal from './components/Modal';

import {
  Container,
  AddedCompaniesContainer,
  FoundCompaniesContainer,
  Header,
  Button,
  Spaced,
  SearchInput,
  Divider,
  Card,
  Centered,
  Overlay,
  CompanyAdder,
} from './styled_components';

import {
  getData, simplifyName, getDifference, getUniqCompanies, byMatchScore, fromNamesToCompanies,
} from './helpers';

import {
  NOOP,
  SEARCHING,
  ADDING,
  ADDING_DONE,
  ALREADY_ADDED,
  SEARCHING_DONE,
  API_LIMIT_REACHED,
  nameAttr,
  symbolAttr,
} from './helpers/constants';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyName: '',
      showModal: false,
      progress: NOOP,
      foundCompanies: [],
      addedCompanies: [],
    };
  }

  searchForCompanyHandler = async ({ target: { value } }) => {
    this.setState({
      progress: value ? SEARCHING : NOOP,
    });

    if (value) {
      const searchWithSymbolEndpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${process.env.REACT_APP_ALPHAVANTAGE_API_KEY}`;
      const { data: { bestMatches: companies } } = await axios.get(searchWithSymbolEndpoint);

      if (companies && companies.length) {
        this.setState({
          progress: SEARCHING_DONE,
          foundCompanies: companies.sort(byMatchScore),
        });
      } else {
        this.setState({
          progress: API_LIMIT_REACHED,
        });
      }
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

  showModal = (companyName) => {
    this.setState({
      showModal: true,
      companyName
    });
  };

  removeCompanyHandler = (companyName) => {
    this.setState(({ addedCompanies }) => ({
      showModal: false,
      progress: NOOP,
      addedCompanies: addedCompanies.filter(
        addedCompany => addedCompany.name !== companyName,
      ),
    }));
  };

  render() {
    const { state } = this;

    return (
      <>
        {state.showModal && <Modal>
          <Overlay>
            <Card>
              <h3>Are you sure to remove?</h3>

              <Centered>
                <Spaced>
                  <Button onClick={() => {
                    this.removeCompanyHandler(state.companyName);
                  }}>
                    remove
                  </Button>
                  <Button onClick={() => {
                    this.setState({
                      showModal: false
                    });
                  }}>
                    cancel
                  </Button>
                </Spaced>
              </Centered>
            </Card>
          </Overlay>
        </Modal>}
        <Container>
          <CompanyAdder>
            <Header>
              SEARCH
            </Header>
            <SearchInput placeholder="provide a symbol" onChange={this.searchForCompanyHandler}/>
            <FoundCompaniesContainer>
              <FoundCompanies
                progress={state.progress}
                addCompanyHandler={this.addCompanyHandler}
                foundCompanies={state.foundCompanies}
              />
            </FoundCompaniesContainer>
            <Header>
              {state.progress}
            </Header>
          </CompanyAdder>
          <Divider/>
          <AddedCompaniesContainer>
            <Header>
              ADDED COMPANIES
            </Header>
            <AddedCompanies
              addedCompanies={state.addedCompanies}
              showModal={this.showModal}
            />
          </AddedCompaniesContainer>
        </Container>
      </>
    );
  }
}

export default App;
