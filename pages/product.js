import React from 'react';
import { Query } from 'react-apollo';
import { Page } from '../components';
import Product from '../ui/product';
import pdpQuery from '../src/graphql/product';
import { CloudinaryContext } from '../lib/cloudinary';

const defaultSchoolCode = 'OCM';
const cloudinaryImagePath = 'wws/products';
const cloudinaryCloudName = 'ocm';

const ProductWithData = (
  { query, domain } // URL params passed here
) => {
  const schoolCode = query.school || defaultSchoolCode;

  const productSlugParts = query.slug.split('-');
  const productId = productSlugParts[productSlugParts.length - 1];

  return (
    <CloudinaryContext.Provider
      value={{
        cloudName: cloudinaryCloudName,
        imagePath: cloudinaryImagePath
      }}
    >
      <Query query={pdpQuery} variables={{ id: productId }}>
        {({ loading, error, data }) => (
          <Page>
            <Product
              loading={loading}
              error={error}
              data={data}
              schoolCode={schoolCode}
              domain={domain}
              urlInfo={query}
            />
          </Page>
        )}
      </Query>
    </CloudinaryContext.Provider>
  );
};

ProductWithData.getInitialProps = ({ query }) => {
  return {
    query
  };
};

export default ProductWithData;
