import React from 'react';

import { Query } from 'react-apollo';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Page, OverlayProgress } from '../components';
import PrivacyPolicy from '../ui/privacypolicy';
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

const PrivacyPolicyPage = ({ classes, ...props }) => {
  // console.log(props);
  const schoolCode = 'OCM';

  return (
    <Page>
      <Query query={query} variables={{ schoolCode, path: '/privacy-policy' }}>
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
              <PrivacyPolicy page={content} {...props} />
            </Grid>
          );
        }}
      </Query>
    </Page>
  );
};

PrivacyPolicyPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PrivacyPolicyPage);
