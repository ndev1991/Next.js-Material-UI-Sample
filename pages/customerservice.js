import React from 'react';

import { Query } from 'react-apollo';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Page, OverlayProgress } from '../components';
import CustomerService from '../ui/customerservice';
import query from '../src/graphql/content-pages';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit / 2, // Header shadow
    paddingLeft: '0 !important'
  },
  nowLoading: {
    margin: theme.spacing.unit * 2,
    textAlign: 'center'
  }
});

const CustomerServicePage = ({ classes, ...props }) => {
  // console.log(props);
  const schoolCode = 'OCM';

  return (
    <Page>
      <Query
        query={query}
        variables={{ schoolCode, path: '/customer-service' }}
      >
        {({ error, loading, data }) => {
          if (error) {
            console.error(error);
            return (
              <h1 style={{ color: 'red', textAlign: 'center' }}>
                Error querying endpoint.
              </h1>
            );
          }
          if (loading)
            return (
              <div className={classes.nowLoading}>
                Welcome to OCM
                <OverlayProgress />
              </div>
            );
          const { content } = data.spa;
          // const { root: page } = JSON.parse(content);
          // const { page } = content;
          // console.log(content);
          // console.log(`page: ${page}`);
          return (
            <Grid container className={classes.container}>
              <CustomerService page={content} {...props} />
            </Grid>
          );
        }}
      </Query>
    </Page>
  );
};

CustomerServicePage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomerServicePage);
