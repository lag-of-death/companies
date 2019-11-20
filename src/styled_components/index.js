import styled from 'styled-components';

import { blackColor, whiteColor, grayColor } from './vars';

const center = `
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: white;
  border: 2px solid ${blackColor};
  max-width: 70%;
  padding: 2rem;
`;

const Centered = styled.div`
  ${center}
`;

const Spaced = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Overlay = styled.div`
  ${center}
  font-size: 2rem;
  position: fixed;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  background: rgba(0, 0, 0, 0.5);
`;

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
  font-size: 30px;
  margin-bottom: 6px;
  text-align: center;
  word-break: break-all;
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
  font-size: 1.5rem;
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

const Domain = styled.div`
  width: 15%;
  word-break: break-all;
`;

const TradingHours = styled.div`
  text-align: center;
`;

const Price = styled.div`
  text-align: center;
  width: 10%;  
  word-break: break-all; 
`;

const PriceChange = styled.div`
  text-align: center;
  width: 10%;
  word-break: break-all; 
`;

const Name = styled.div`
  width: 20%; 
  word-break: break-word;
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
  Domain,
  TradingHours,
  Name,
  Price,
  Card,
  PriceChange,
  Overlay,
  Centered,
  Spaced
};
