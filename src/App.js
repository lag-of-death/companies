import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

const SearchButton = styled.button`
  border: 2px solid ${blackColor};
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
    const url = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${value}`;

    const { data } = await axios.get(url);

    this.setState({
      foundCompanies: data,
    });
  };

  addCompanyHandler = (company) => {
    this.setState(({ addedCompanies }) => {
      const isAdded = addedCompanies.find(addedCompany => addedCompany.name === company.name);

      return isAdded ? {} : { addedCompanies: addedCompanies.concat(company) };
    });
  };

   removeCompanyHandler = (company) => {
     const isRemovingConfirmed = window.confirm('Are you sure to remove?');

     if (isRemovingConfirmed) {
       this.setState(({ addedCompanies }) => ({
         addedCompanies: addedCompanies.filter(addedCompany => addedCompany.name !== company.name),
       }));
     }
   };

   static renderCompanies(companies, getComponent = () => null) {
     return (
       companies.map((company) => {
         const { name, logo } = company;

         return (
           <Company key={`${name}:${logo}`}>
             <div style={{ width: '40%' }}>
               { name }
             </div>
             <Logo>
               <img alt={logo} src={logo} />
             </Logo>
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
           <SearchButton>search</SearchButton>
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
              company => <Button onClick={() => this.removeCompanyHandler(company)}>X</Button>,
            )
          }
         </AddedCompanies>
       </Container>
     );
   }
}

export default App;
