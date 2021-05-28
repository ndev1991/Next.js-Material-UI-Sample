import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Grid, CircularProgress } from '@material-ui/core';
import { Query } from 'react-apollo';
import OrderHeader from './OrderHeader';
import OrderConsigment from './OrderConsigment';
import { CloudinaryContext } from '../../../lib/cloudinary';
import { meOrders } from '../../../src/graphql/user';

const cloudinaryImagePath = 'wws/products';
const cloudinaryCloudName = 'ocm';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit
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
  }
});

const Orders = ({ classes }) => (
  <Query query={meOrders}>
    {({ data, loading, error }) => {
      if (loading)
        return (
          <div className={classes.nowLoadingDiv}>
            <Typography
              component="h1"
              color="textPrimary"
              className={classes.message}
            >
              Loading orders...
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
            An error has ocurred while loading your orders
          </Typography>
        );
      }
      const { orders } = data && data.me;
      orders.sort((a, b) => b.id - a.id); // Sort by id
      return (
        <CloudinaryContext.Provider
          value={{
            cloudName: cloudinaryCloudName,
            imagePath: cloudinaryImagePath
          }}
        >
          <Grid container className={classes.root}>
            {/* <Grid item xs={12}>
              <Typography variant="h5">My Orders</Typography>
            </Grid> */}
            {orders.length ? (
              orders.map((o, k) => (
                <Grid item xs={12} key={k}>
                  <OrderHeader order={o} />
                  {o.consignments &&
                    o.consignments.map((c, ck) => (
                      <OrderConsigment consignment={c} key={ck} />
                    ))}
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  component="h1"
                  color="textPrimary"
                  className={classes.message}
                >
                  You don't have any orders registered lately
                </Typography>
              </Grid>
            )}
          </Grid>
        </CloudinaryContext.Provider>
      );
    }}
  </Query>
);

export default withStyles(styles)(Orders);
