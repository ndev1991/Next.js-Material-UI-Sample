import React from 'react';
import { Query } from 'react-apollo';

import { Page } from '../components';
import Category from '../ui/category';
import { queryNavigation } from '../src/graphql/category';

const defaultSchoolCode = 'OCM';

const CategoryWithData = (
  { query } // URL params passed here
) => {
  const schoolCode = query.school || defaultSchoolCode;
  const LOB = query.lineOfBusiness;
  const CAT = query.category;

  return (
    <Query query={queryNavigation} variables={{ schoolCode }}>
      {props => {
        if (props.loading) return 'Loading...';
        if (props.error) return `Error! ${props.error.message}`;

        if (
          !(
            props.data &&
            props.data.navigation &&
            props.data.navigation.children
          )
        ) {
          return 'Error in navigation GQL!';
        }

        const LOBNav = props.data.navigation.children.filter(child => {
          return child.url === `/${LOB}`;
        });

        if (!(LOBNav && LOBNav[0] && LOBNav[0].children)) {
          return 'Error in navigation GQL!';
        }

        const CATNav = LOBNav[0].children.filter(child => {
          return child.url === `/${LOB}/${CAT}`;
        });

        return (
          <Page>
            <Category
              navigation={CATNav[0]}
              schoolCode={schoolCode}
              urlInfo={query}
            />
          </Page>
        );
      }}
    </Query>
  );
};

CategoryWithData.getInitialProps = ({ query }) => {
  return {
    query
  };
};

export default CategoryWithData;
