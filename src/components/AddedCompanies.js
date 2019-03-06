import React from 'react';
import PropTypes from 'prop-types';

import { Company } from '../styled_components';
import FoundCompanyDataViewer from './FoundCompanyDataViewer';

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

AddedCompanies.propTypes = {
  addedCompanies: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeCompanyHandler: PropTypes.func.isRequired,
};

export default AddedCompanies;
