import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Hidden, Typography, Button } from '@material-ui/core';
import { graphql, compose } from 'react-apollo';
import classNames from 'classnames';

import { CartProvider } from './context';
import CartContainer from './CartContainer';
import OrderSummary from './OrderSummary';
import {
  getCart,
  removeCartItem,
  updateCartItem
} from '../../src/graphql/cart';
import {
  gtmRemoveCartItem,
  gtmUpdateCartItem,
  gtmCartLoad
} from '../../src/gtm/cart';
import Recommendations from '../../components/widgets/Recommendations';
import LoadingSpinner from '../../components/LoadingSpinner';

const routes = require('next-routes')();

const styles = theme => ({
  root: {
    width: '90%',
    margin: 'auto',
    padding: 20
  },
  button: {
    margin: theme.spacing.unit
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  },
  typoButton: {
    color: theme.palette.common.grey['800'],
    textDecoration: 'underline',
    cursor: 'pointer',

    '&:hover': {
      fontWeight: 400
    }
  },
  endorsedLink: {
    color: theme.palette.primary.main,

    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  typography: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    color: theme.palette.common.grey['800']
  },
  centerButton: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

const Cart = props => {
  const {
    classes,
    schoolcode,
    templateOptions,
    color,
    sessionId,
    browserId
  } = props;
  const { cart } = props.getCart;
  const endorsed = schoolcode.toLowerCase() !== 'ocm';

  if (props.getCart.loading || (!sessionId && !browserId)) {
    return (
      <div className={classes.root}>
        <LoadingSpinner />
      </div>
    );
  }

  const [items, setItems] = useState(cart.items);

  useEffect(() => {
    if (!props.getCart.loading) {
      // GTM - On Cart page load
      gtmCartLoad(cart);
    }
  }, [props.getCart.loading]);

  useEffect(() => {
    setItems(props.getCart.cart.items);
  }, [props.getCart.cart.items]);

  const removeItem = item => () => {
    props.removeCartItem({
      variables: {
        schoolcode,
        domain: cart.createdDomain,
        cartItem: {
          cartId: cart.id,
          id: item.id
        }
      }
    });

    // GTM for removing item
    gtmRemoveCartItem(item);
  };

  const upgradeItem = (id, newItem) => {
    props.updateCartItem({
      variables: {
        schoolcode,
        domain: cart.createdDomain,
        cartItem: {
          cartId: cart.id,
          id,
          quantity: newItem.quantity
        }
      }
    });

    // GTM for updating item
    gtmUpdateCartItem(newItem);
  };

  const createCheckout = async () => {
    routes.Router.push(
      `/${schoolcode.toLowerCase() !== 'ocm' ? `${schoolcode}/` : ''}checkout`
    );
  };

  return (
    <CartProvider
      value={{
        items,
        removeItem,
        upgradeItem,
        schoolcode,
        createCheckout
      }}
    >
      <div className={classes.root}>
        <Grid container spacing={8}>
          {items.length > 0 && (
            <>
              <Grid item md={8} sm={12}>
                <CartContainer color={color} />
              </Grid>
              <Hidden xsDown>
                <Grid item md={4} sm={12}>
                  <OrderSummary />
                </Grid>
              </Hidden>
            </>
          )}
          {(!items || !items.length) && (
            <Grid item container alignItems="center" direction="column">
              <Typography
                className={classes.typography}
                variant="h4"
                align="center"
                gutterBottom
              >
                Your cart is empty.
              </Typography>
              <Typography
                className={classes.typography}
                variant="h6"
                align="center"
                gutterBottom
              >
                Visit our{' '}
                <Link
                  href={`/${
                    schoolcode.toLowerCase() !== 'ocm' ? schoolcode : ''
                  }`}
                >
                  <a
                    className={classNames(
                      classes.typoButton,
                      endorsed ? classes.endorsedLink : ''
                    )}
                  >
                    home page
                  </a>
                </Link>{' '}
                for featured items or browse our collections
                <br /> above to add items to your cart.
              </Typography>
              <Button
                className={classes.centerButton}
                color="secondary"
                onClick={() =>
                  routes.Router.push(
                    `/${schoolcode.toLowerCase() !== 'ocm' ? schoolcode : ''}`
                  )
                }
                variant="contained"
              >
                Continue Shopping
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Recommendations
              search
              schoolCode={schoolcode}
              options={templateOptions.bestSellers}
              title="Other customers are buying..."
              gtmList="cart"
              searchTerm="default_c4rt_p4g3_tr3nd1ng"
              buttonOptions={{
                label: 'View Detail',
                action: item => {
                  routes.Router.push(
                    `${schoolcode !== 'OCM' ? `/${schoolcode}` : ''}${
                      item.pdpUrl.includes('/product')
                        ? item.pdpUrl
                        : `/product${item.pdpUrl
                            .replace(/\/$/, '')
                            .substr(item.pdpUrl.lastIndexOf('/'))}`
                    }`
                  );
                }
              }}
            />
          </Grid>
        </Grid>
      </div>
    </CartProvider>
  );
};

Cart.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  graphql(getCart, { name: 'getCart' }),
  graphql(removeCartItem, { name: 'removeCartItem' }),
  graphql(updateCartItem, { name: 'updateCartItem' }),
  withStyles(styles)
)(Cart);
