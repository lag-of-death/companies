import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Domain, Logo, Name, Price, PriceChange, TradingHours, Img,
} from '../styled_components';

const FoundCompanyDataViewer = ({
  domain, name, logo, showModal, marketOpen, marketClose, price, priceChange,
}) => (
  <React.Fragment>
    <Domain title="domain">
      {domain}
    </Domain>
    <TradingHours title="trading hours">
      {marketOpen} - {marketClose}
    </TradingHours>
    <Price title="price">
      {price}
    </Price>
    <PriceChange title="price change">
      {priceChange}
    </PriceChange>
    <Name title="name">
      {name}
    </Name>
    <Logo title="logo">
      <Img alt={name.split(' ')[0]} src={logo} />
    </Logo>
    <Button onClick={() => showModal(name)}>X</Button>
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
  showModal: PropTypes.func.isRequired,
};

export default FoundCompanyDataViewer;
