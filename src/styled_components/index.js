import styled from 'styled-components';

import { blackColor, whiteColor, grayColor } from './vars';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  
  @media(min-width: 768px) {
    flex-direction: row;
    padding: 40px;
    justify-content: space-between;
  }
`;

const AddedCompaniesContainer = styled.div`
  border: 2px solid ${blackColor};
  padding: 8px;

  @media(min-width: 768px) {
    width: 60%;
  }  
`;

const FoundCompaniesContainer = styled.div`
  margin-top: 8px;
  padding: 8px;
`;

const Header = styled.div`
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
  font-size: 30px;
  padding: 2px;
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

const Divider = styled.div`
  @media(min-width: 768px) {
    min-width: 5%;
  }
`;

const Logo = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  width: 10%;
  
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
  padding: 8px;

  @media(min-width: 768px) {
    border: 2px solid ${blackColor};
    width: 30%;
  }
`;

export {
  Container,
  AddedCompaniesContainer,
  FoundCompaniesContainer,
  SearchInput,
  Company,
  Header,
  Divider,
  Logo,
  Button,
  CompanyAdder,
};
