import React from 'react';
import PropTypes from 'prop-types';

import { Button, Company, Logo } from '../styled_components';
import { nameAttr, symbolAttr, ADDING } from '../helpers/constants';

const AddedCompanies = ({ addedCompanies, removeCompanyHandler }) => addedCompanies.map(
  addedCompany => (
    <Company key={addedCompany.name}>
      <FoundCompanyDataViewer
        marketOpen={addedCompany['5. marketOpen']}
        marketClose={addedCompany['6. marketClose']}
        removeCompanyHandler={removeCompanyHandler}
        {...addedCompany}
      />
    </Company>
  ),
);

const FoundCompanyDataViewer = ({
  domain, name, logo, removeCompanyHandler, marketOpen, marketClose, price, priceChange,
}) => (
  <React.Fragment>
    <div title="domain" style={{ width: '15%', wordBreak: 'break-all' }}>
      {domain}
    </div>
    <div title="trading hours" style={{ width: '5%', textAlign: 'center' }}>
      {marketOpen} - {marketClose}
    </div>
    <div title="price" style={{ width: '10%' }}>
      {price}
    </div>
    <div title="price change" style={{ width: '10%' }}>
      {priceChange}
    </div>
    <div title="name" style={{ width: '20%', wordBreak: 'break-word' }}>
      { name }
    </div>
    <Logo title="logo">
      <img alt={name} src={logo} />
    </Logo>
    <Button onClick={() => removeCompanyHandler(name)}>X</Button>
  </React.Fragment>
);

FoundCompanyDataViewer.defaultProps = {
  price: '',
  priceChange: '',
};

FoundCompanyDataViewer.propTypes = {
  domain: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string,
  priceChange: PropTypes.string,
  marketOpen: PropTypes.string.isRequired,
  marketClose: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  removeCompanyHandler: PropTypes.func.isRequired,
};

const FoundCompanies = ({ progress, addCompanyHandler, foundCompanies }) => (
  foundCompanies.map((company, companyIdx) => {
    const { [symbolAttr]: symbol, [nameAttr]: companyName } = company;

    return (
      <Company key={`${companyName}:${symbol}:${companyIdx}`}>
        <div style={{ width: '40%' }}>
          { companyName }
        </div>
        <Button
          disabled={progress === ADDING}
          onClick={() => addCompanyHandler(company)}
        >
          add
        </Button>
      </Company>
    );
  })
);

export {
  AddedCompanies, FoundCompanies,
};
