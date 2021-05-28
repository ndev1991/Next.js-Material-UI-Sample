import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import classnames from 'classnames';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  left: {
    textAlign: 'left',
    textTransform: 'uppercase'
  },
  right: {
    textAlign: 'right',
    textTransform: 'uppercase'
  },
  priceItems: {
    [theme.breakpoints.down('md')]: {},
    justifyContent: 'space-evenly'
  },
  money: {
    fontSize: 16,
    [theme.breakpoints.down('md')]: {
      fontSize: 10
    },
    color: theme.palette.common.grey[900],
    fontFamily: 'Oswald'
  },
  moneyBold: {
    fontSize: 18,
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
      fontSize: 12
    },
    color: theme.palette.common.grey[900],
    fontFamily: 'Oswald'
  },
  placedOn: {
    alignSelf: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  bold: {
    fontWeight: 500
  },
  shippingAndHandling: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 8
    }
  }
});

const OrderHeader = ({ classes, order }) => (
  <Grid container className={classes.root}>
    <Grid item xs={6}>
      <Typography
        variant="body1"
        className={classnames(classes.left, classes.bold)}
      >
        Order {order.orderStatus}
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="body1" className={classes.right}>
        Order <span className={classes.bold}>#{order.ecometryOrderNumber}</span>
      </Typography>
    </Grid>
    <Grid item xs={6} className={classes.placedOn}>
      <Typography variant="body1">
        {`${moment(order.placedOn).format('MMMM Do YYYY, h:mm:ss a')}`}
      </Typography>
    </Grid>
    <Grid item xs={6} className={classes.right}>
      <Typography component="div" variant="body1" className={classes.money}>
        <Grid container item className={classes.priceItems}>
          <Grid item xs={8}>
            Subtotal:
          </Grid>
          <Grid item xs={4}>{`$${order.subtotal.toFixed(2)}`}</Grid>
        </Grid>
      </Typography>
      <Typography component="div" variant="body1" className={classes.money}>
        <Grid container item className={classes.priceItems}>
          <Grid item xs={8}>
            Tax:
          </Grid>
          <Grid item xs={4}>{`$${order.tax.toFixed(2)}`}</Grid>
        </Grid>
      </Typography>
      <Typography component="div" variant="body1" className={classes.money}>
        <Grid container item className={classes.priceItems}>
          <Grid item xs={8} className={classes.shippingAndHandling}>
            Shipping &amp; Handling:
          </Grid>
          <Grid item xs={4}>
            {`$${order.consignments
              .reduce((a, c) => a + c.shippingCost + c.shippingTax, 0.0)
              .toFixed(2)}`}
          </Grid>
        </Grid>
      </Typography>
      <Typography component="div" variant="body1" className={classes.moneyBold}>
        <Grid container item className={classes.priceItems}>
          <Grid item xs={8}>
            Total:
          </Grid>
          <Grid item xs={4}>{`$${order.total.toFixed(2)}`}</Grid>
        </Grid>
      </Typography>
    </Grid>
  </Grid>
);

export default withStyles(styles)(OrderHeader);
