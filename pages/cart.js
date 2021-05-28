import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import { Page } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';
import Cart from '../ui/cart';
import { CloudinaryContext } from '../lib/cloudinary';
import SessionContext from '../lib/sessionContext';
import { querySite, queryTemplateConfiguration } from '../src/graphql/site';

const defaultSchoolCode = 'OCM';

const CartPage = ({ query, domain }) => {
  const schoolcode = query.school || defaultSchoolCode;
  const { browserId, sessionId } = useContext(SessionContext);
  return (
    <Page>
      <Query query={querySite} variables={{ schoolCode: schoolcode }}>
        {({ data, loading: siteLoading, error: siteError }) => {
          if (siteLoading) return <LoadingSpinner />;
          if (siteError) return `Error! ${siteError.message}`;
          const { site } = data;
          return (
            <Query
              query={queryTemplateConfiguration}
              variables={{ schoolCode: schoolcode, path: '/cart' }}
            >
              {({ data: { spa }, loading, error: spaError }) => {
                if (spaError) return `Error! ${spaError.message}`;
                if (loading) return <LoadingSpinner />;

                const { configuration } = spa;
                const { root: config } = JSON.parse(configuration);
                const { options } = config;
                const {
                  cloudinaryCloudName,
                  cloudinaryImagePath,
                  color
                } = site || { color: '#707070' };

                return (
                  <CloudinaryContext.Provider
                    value={{
                      cloudName: cloudinaryCloudName,
                      imagePath: cloudinaryImagePath
                    }}
                  >
                    <Cart
                      color={color}
                      userId={null}
                      browserId={browserId}
                      sessionId={sessionId}
                      schoolcode={schoolcode}
                      domain={domain}
                      templateOptions={options}
                    />
                  </CloudinaryContext.Provider>
                );
              }}
            </Query>
          );
        }}
      </Query>
    </Page>
  );
};

CartPage.getInitialProps = ({ query }) => {
  return {
    query
  };
};

export default CartPage;
