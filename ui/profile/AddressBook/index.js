import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Grid, CircularProgress } from '@material-ui/core';
import { Query } from 'react-apollo';
import { meAddresses } from '../../../src/graphql/user';
import AddressCard from './AddressCard';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 2
  },
  nowLoadingDiv: {
    textAlign: 'center'
  },
  message: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 18,
    textAlign: 'center',
    margin: theme.spacing.unit * 2
  },
  addressCard: {
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

const Addresses = ({ classes }) => (
  <Query query={meAddresses}>
    {({ data, loading, error }) => {
      if (loading)
        return (
          <div className={classes.nowLoadingDiv}>
            <Typography
              component="h1"
              color="textPrimary"
              className={classes.message}
            >
              Loading addresses...
            </Typography>
            <CircularProgress />
          </div>
        );
      if (error) {
        console.error(error);
        return (
          <Typography
            component="h1"
            className={classes.message}
            color="textPrimary"
          >
            An error has ocurred while loading your addresses
          </Typography>
        );
      }
      const { addresses } = data && data.me;

      return (
        <Grid container className={classes.root}>
          {addresses &&
            addresses.map((a, k) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={k}
                className={classes.addressCard}
              >
                <AddressCard address={a} />
              </Grid>
            ))}
        </Grid>
      );
    }}
  </Query>
);

export default withStyles(styles)(Addresses);
