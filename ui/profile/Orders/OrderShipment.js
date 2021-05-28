import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import OrderItem from './OrderItem';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default
  }
});

const Orders = ({ classes, shipment }) => (
  <Grid item container className={classes.root}>
    {shipment.items &&
      shipment.items.map((i, k) => <OrderItem item={i} key={`item-${k}`} />)}
  </Grid>
);

export default withStyles(styles)(Orders);
