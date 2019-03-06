import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const nameAttr = '2. name';
const symbolAttr = '1. symbol';

const blackColor = '#000';
const whiteColor = '#FFF';
const grayColor = '#D3D3D3';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  
  @media(min-width: 768px) {
    flex-direction: row;
    padding: 40px;
  }
`;

const AddedCompanies = styled.div`
  border: 2px solid ${blackColor};
  flex-grow: 4;
  padding: 8px;
`;

const FoundCompanies = styled.div`
  margin-top: 8px;
  padding: 8px;
`;

const AddedCompaniesHeader = styled.div`
  background: ${blackColor};
  color: ${whiteColor};
  font-family: sans-serif;
  font-size: 30px;
  margin-bottom: 6px;
  text-align: center;
`;

const SearchInput = styled.input`
  border: 2px solid ${blackColor};
  margin-bottom: 2px;
`;

const Company = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
  margin-top: 2px;
  
  &:hover {
    background: ${grayColor}
  }
`;

const SearchCompanyHeader = styled.div`
  background: ${blackColor};
  color: ${whiteColor};
  font-family: sans-serif;
  font-size: 30px;
  margin-bottom: 6px;
  text-align: center;
`;

const Divider = styled.div`
  flex-grow: 1;
`;

const Logo = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  width: 20%;
  
  img {
    width: 100%;
  }
`;

const Button = styled.button`
  border: 2px solid ${blackColor};
`;

const CompanyAdder = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  padding: 8px;

  @media(min-width: 768px) {
    border: 2px solid ${blackColor};
  }
`;

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
        foundCompanies: companies,
      });
    }
  };

  addCompanyHandler = async (foundCompany) => {
    const logoEndpoint = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${foundCompany[nameAttr]}`;
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
          notAddedCompaniesNames.map(
            notAddedCompanyName => uniqCompanies.find(({ name }) => name === notAddedCompanyName),
          ),
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
