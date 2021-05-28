import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid, Divider, Hidden, Button } from '@material-ui/core';

import { CartConsumer } from './context';
import SchoolLogo from '../../static/img/icons/SchoolLogo';
import ItemShipment from './ItemShipment';

const styles = theme => ({
  button: {
    background: 'grey',
    textTransformation: 'none',
    color: 'white'
  },
  logo: {
    width: 42,
    height: 42
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  },
  group: {
    flexDirection: 'row'
  },
  method: {
    border: '1px solid grey',
    padding: theme.spacing.unit,
    margin: theme.spacing.unit
  },
  typoButton: {
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  schoolLogo: {
    [theme.breakpoints.down('sm')]: {
      width: 30,
      height: 30
    }
  },
  primaryButton: {
    backgroundColor: theme.palette.common.grey['800'],
    color: 'white',
    textTransform: 'none',
    borderRadius: 0
  }
});

const CartContainer = props => {
  const { classes, color } = props;

  const renderNotification = () => (
    <Grid item container spacing={8} alignItems="center">
      <Grid item container alignItems="center" justify="center" md={1} xs={2}>
        <Grid item className={classes.logo}>
          <SchoolLogo color={color} />
        </Grid>
      </Grid>
      <Grid item md={11} xs={10}>
        <Typography variant="subtitle2">
          Score! Campus Delivery Available
        </Typography>
        <Typography>
          One or more of your items is available for Campus Delivery. Just
          select Campus Delivery under shipping options in Checkout.
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <CartConsumer>
      {({ items, removeItem, upgradeItem, createCheckout, schoolcode }) => {
        const totalPrice =
          items &&
          items
            .reduce((price, item) => price + item.quantity * item.unitPrice, 0)
            .toFixed(2);
        const campusAvailable =
          items &&
          items.reduce(
            (isAvailable, item) => isAvailable || item.canShipToSchool,
            false
          );
        const endorsed = schoolcode.toLowerCase() !== 'ocm';

        return (
          <Grid container direction="column">
            <Hidden smUp>
              <Grid item container direction="column">
                <Grid item>
                  <Typography variant="h6">Order Summary</Typography>
                </Grid>
                <Divider className={classes.divider} />
                <Grid item container justify="space-between">
                  <Typography variant="subtitle2">
                    Subtotal
                    <span>{` (${items.length} items)`}</span>
                  </Typography>
                  <Typography variant="subtitle2">{`$${totalPrice}`}</Typography>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item container direction="column" spacing={16}>
                {endorsed && campusAvailable && renderNotification()}
                <Grid item>
                  <Button
                    className={classes.primaryButton}
                    onClick={createCheckout}
                    fullWidth
                  >
                    Proceed to Checkout
                  </Button>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
            </Hidden>
            <Grid item container justify="center">
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  {`Your Cart (${items.length} ${
                    items.length === 1 ? 'item' : 'items'
                  })`}
                </Typography>
              </Grid>
            </Grid>
            {endorsed && campusAvailable && (
              <Hidden smDown>{renderNotification()}</Hidden>
            )}
            <Grid item>
              <Divider className={classes.divider} />
            </Grid>
            <Grid item container direction="column">
              {items
                .sort((i1, i2) => i1.id - i2.id)
                .map((item, id) => (
                  <React.Fragment key={id}>
                    <Grid item xs={12}>
                      <ItemShipment
                        classes={classes}
                        schoolcode={schoolcode}
                        number={id + 1}
                        total={items.length}
                        item={item}
                        color={color}
                        onRemoveItem={removeItem(item)}
                        onUpdateItem={upgradeItem}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider className={classes.divider} />
                    </Grid>
                  </React.Fragment>
                ))}
            </Grid>
            <Hidden smUp>
              <Grid item>
                <Button
                  className={classes.primaryButton}
                  onClick={createCheckout}
                  fullWidth
                >
                  Proceed to Checkout
                </Button>
              </Grid>
            </Hidden>
          </Grid>
        );
      }}
    </CartConsumer>
  );
};

CartContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CartContainer);
