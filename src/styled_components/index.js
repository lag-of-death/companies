import styled from 'styled-components';

import { blackColor, whiteColor, grayColor } from './vars';

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

export {
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
};
