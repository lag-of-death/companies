import React from 'react';
import PropTypes from 'prop-types';

import { Company } from '../styled_components';
import FoundCompanyDataViewer from './FoundCompanyDataViewer';

const AddedCompanies = ({ addedCompanies, showModal }) => addedCompanies.map(
  addedCompany => (
    <Company key={addedCompany.name}>
      <FoundCompanyDataViewer
        marketOpen={addedCompany['5. marketOpen']}
        marketClose={addedCompany['6. marketClose']}
        showModal={showModal}
        {...addedCompany}
      />
    </Company>
  ),
);

AddedCompanies.propTypes = {
  addedCompanies: PropTypes.arrayOf(PropTypes.object).isRequired,
  showModal: PropTypes.func.isRequired,
};

export default AddedCompanies;
