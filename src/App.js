import React, { Component } from 'react';
import styled from 'styled-components';

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
  border-top: 2px solid ${blackColor};
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

const FoundCompany = styled.div`
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

const SearchButton = styled.button`
  border: 2px solid ${blackColor};
`;

const Divider = styled.div`
  flex-grow: 1;
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
