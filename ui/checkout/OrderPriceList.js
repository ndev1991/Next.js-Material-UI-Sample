import React from 'react';
import { Grid, Divider, Typography } from '@material-ui/core';
import classNames from 'classnames';
import numeral from 'numeral';

const OrderPriceList = ({ order, classes }) => {
  const itemCount = order.consignments.reduce(
    (cc, consignment) =>
      cc +
      consignment.shipments.reduce(
        (count, shipment) => count + shipment.items.length,
        0
      ),
    0
  );
  const { subtotal, total, discount, shipping } = order;

  return (
    <Grid
      item
      container
      direction="column"
      className={classes.inner}
      spacing={8}
    >
      <Grid item container justify="space-between">
        <Typography className={classNames(classes.typography, 'productTitle')}>
          Subtotal
          <span>{` (${itemCount} item(s))`}</span>
        </Typography>
        <Typography className={classNames(classes.typography, 'productTitle')}>
          {numeral(subtotal).format('$0,0.00')}
        </Typography>
      </Grid>
      {discount > 0 && (
        <Grid item container justify="space-between">
          <Typography
            className={classNames(classes.typography, 'productTitle')}
          >
            Discount
          </Typography>
          <Typography
            className={classNames(classes.typography, 'productTitle')}
          >
            {`-${numeral(order.discount).format('$0,0.00')}`}
          </Typography>
        </Grid>
      )}
      <Grid item container justify="space-between">
        <Typography className={classNames(classes.typography, 'productTitle')}>
          Shipping
        </Typography>
        <Typography className={classNames(classes.typography, 'productTitle')}>
          {numeral(shipping).format('$0,0.00')}
        </Typography>
      </Grid>
      <Grid item container justify="space-between">
        <Typography className={classNames(classes.typography, 'productTitle')}>
          Estimated Tax*
        </Typography>
        <Typography className={classNames(classes.typography, 'productTitle')}>
          {numeral(order.tax).format('$0,0.00')}
        </Typography>
      </Grid>
      <Divider />
      <Grid container justify="space-between">
        <Typography className={classNames(classes.typography, 'productTitle')}>
          Total
        </Typography>
        <Typography className={classNames(classes.typography, 'productTitle')}>
          {numeral(total).format('$0,0.00')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default OrderPriceList;
