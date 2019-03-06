import React from 'react';
import PropTypes from 'prop-types';

import { Button, Logo } from '../styled_components';

const FoundCompanyDataViewer = ({
  domain, name, logo, removeCompanyHandler,
}) => (
  <React.Fragment>
    <div>
      {domain}
    </div>
    { name }
    <Logo>
      <img alt={name} src={logo} />
    </Logo>
    <Button onClick={() => removeCompanyHandler(name)}>X</Button>
  </React.Fragment>
);

FoundCompanyDataViewer.propTypes = {
  domain: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  removeCompanyHandler: PropTypes.func.isRequired,
};

export default FoundCompanyDataViewer;
