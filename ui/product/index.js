import React from 'react';
import Head from 'next/head';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { OverlayProgress } from '../../components';

import Product from './Product';
import ErrorView from '../../components/widgets/ErrorView';

const defaultErrorMessage =
  'Something went wrong in loading product. Please try again.';

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 600,
    [theme.breakpoints.only('xs')]: {
      minHeight: 400
    }
  }
});

const getProductTitle = data => {
  if (data && data.pdp && data.pdp.metadata && data.pdp.metadata.length > 0) {
    const meta = data.pdp.metadata.filter(element => element.key === 'Title');

    if (meta && meta.length > 0) {
      const { value } = meta[0];
      if (value) return value;
    }
  }

  if (data && data.pdp && data.pdp.name) {
    return data.pdp.name;
  }

  return 'Product';
};

const getProductDescription = data => {
  if (data && data.pdp && data.pdp.metadata && data.pdp.metadata.length > 0) {
    const meta = data.pdp.metadata.filter(
      element => element.key === 'Description'
    );

    if (meta && meta.length > 0) {
      const { value } = meta[0];
      if (value) return value;
    }
  }

  return '';
};

const getProductKeywords = data => {
  if (data && data.pdp && data.pdp.metadata && data.pdp.metadata.length > 0) {
    const meta = data.pdp.metadata.filter(
      element => element.key === 'Keywords'
    );

    if (meta && meta.length > 0) {
      const { value } = meta[0];
      if (value) {
        const keywords = value
          .split('|')
          .map(element => element.trim())
          .join(', ');
        return keywords;
      }
    }
  }

  return '';
};

const getConfigurations = (data, type) => {
  if (
    data &&
    data.pdp &&
    data.pdp.configurations &&
    data.pdp.configurations.length > 0
  ) {
    const pdpConfigurations = data.pdp.configurations.filter(
      element => element.associationType === type
    );

    return pdpConfigurations;
  }

  return [];
};

const ProductWrapper = ({
  classes,
  loading,
  error,
  data,
  schoolCode,
  domain,
  urlInfo
}) => {
  if (loading)
    return (
      <div className={classes.container}>
        <OverlayProgress />
      </div>
    );

  if (error)
    return (
      <div className={classes.container}>
        <ErrorView message={defaultErrorMessage} />
      </div>
    );

  const title = getProductTitle(data);
  const description = getProductDescription(data);
  const keywords = getProductKeywords(data);
  const pdpConfigurations = getConfigurations(data, 'pdp');

  const product = { ...data.pdp, pdpConfigurations };
  // console.log(product);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link
          rel="canonical"
          href={`https://ocm.com/product/${urlInfo.slug}`}
        />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      <Product
        product={product}
        schoolCode={schoolCode}
        domain={domain}
        urlInfo={urlInfo}
      />
    </div>
  );
};

ProductWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  data: PropTypes.object,
  schoolCode: PropTypes.string.isRequired,
  urlInfo: PropTypes.object.isRequired,
  domain: PropTypes.string.isRequired
};

ProductWrapper.defaultProps = {
  loading: false,
  error: null,
  data: {}
};

export default withStyles(styles)(ProductWrapper);
