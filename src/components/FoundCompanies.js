import React from 'react';
import PropTypes from 'prop-types';
import { ADDING, nameAttr, symbolAttr } from '../helpers/constants';
import { Button, Company } from '../styled_components';

const FoundCompanies = ({ progress, addCompanyHandler, foundCompanies }) => (
  foundCompanies.map((company, companyIdx) => {
    const { [symbolAttr]: symbol, [nameAttr]: companyName } = company;

    return (
      <Company key={`${companyName}:${symbol}:${companyIdx}`}>
        { companyName }
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

FoundCompanies.propTypes = {
  progress: PropTypes.string.isRequired,
  foundCompanies: PropTypes.arrayOf(PropTypes.object).isRequired,
  addCompanyHandler: PropTypes.func.isRequired,
};

export default FoundCompanies;
