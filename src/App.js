import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  
  @media(min-width: 768px) {
    flex-direction: row;
    padding: 40px;
  }
`;

const AddedCompanies = styled.div`
  border: 2px solid black;
  flex-grow: 4;
  padding: 8px;
`;

const FoundCompanies = styled.div`
  border-top: 2px solid black;
  margin-top: 8px;
  padding: 8px;
`;

const AddedCompaniesHeader = styled.div`
  background: black;
  color: white;
  font-family: sans-serif;
  font-size: 30px;
  margin-bottom: 6px;
  text-align: center;
`;

const SearchInput = styled.input`
  border: 2px solid black;
  margin-bottom: 2px;
`;

const FoundCompany = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
  margin-top: 2px;
`;

const SearchCompanyHeader = styled.div`
  background: black;
  color: white;
  font-family: sans-serif;
  font-size: 30px;
  margin-bottom: 6px;
  text-align: center;
`;

const SearchButton = styled.button`
  border: 2px solid black;
`;

const Divider = styled.div`
  flex-grow: 1;
`;

const Button = styled.button`
  border: 2px solid black;
`;

const CompanyAdder = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  padding: 8px;

  @media(min-width: 768px) {
    border: 2px solid black;
  }
`;

class App extends Component {
  static addCompanyHandler(companyName) {
    console.log(companyName);
  }

  constructor(props) {
    super(props);

    this.state = {
      companies: [
        { name: 'XYZ', price: 123 },
        { name: 'ABC', price: 890 },
      ],
    };
  }

  render() {
    const { state } = this;

    return (
      <Container>
        <CompanyAdder>
          <SearchCompanyHeader>
            SEARCH
          </SearchCompanyHeader>
          <SearchInput />
          <SearchButton>search</SearchButton>
          <FoundCompanies>
            {
              state.companies.map(({ name, price }) => (
                <FoundCompany key={`${name}:${price}`}>
                  { name } : { price }
                  <Button onClick={() => App.addCompanyHandler(name)}>add</Button>
                </FoundCompany>
              ))
            }
          </FoundCompanies>
        </CompanyAdder>
        <Divider />
        <AddedCompanies>
          <AddedCompaniesHeader>
            ADDED COMPANIES
          </AddedCompaniesHeader>
          {JSON.stringify(state.companies)}
        </AddedCompanies>
      </Container>
    );
  }
}

export default App;
