import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import OrderShipment from './OrderShipment';
import OrderAddress from './OrderAddress';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    border: `2px solid ${theme.palette.grey[100]}`,
    flexDirection: 'row'
  },
  orders: {
    order: 2,
    [theme.breakpoints.up('sm')]: {
      order: 1
    }
  },
  address: {
    textAlign: 'right',
    order: 1,
    [theme.breakpoints.up('sm')]: {
      order: 2
    }
  }
});

const Orders = ({ classes, consignment }) => (
  <Grid item container className={classes.root}>
    {consignment.shipments &&
      consignment.shipments.map((s, k) => (
        <Grid
          item
          container
          key={`consignment-${k}`}
          className={classes.orders}
        >
          <Grid item xs={12} sm={8} className={classes.orders}>
            <OrderShipment shipment={s} />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.address}>
            <OrderAddress address={consignment.address} />
          </Grid>
        </Grid>
      ))}
  </Grid>
);

export default withStyles(styles)(Orders);
