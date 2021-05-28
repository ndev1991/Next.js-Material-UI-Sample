import { useState } from 'react';
import { Grid, Typography, Button, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import numeral from 'numeral';
import classNames from 'classnames';
// import Link from 'next/link';

import { CheckoutConsumer } from './context';
import InputField from '../../components/forms/InputField';
import OrderSummary from '../../components/OrderSummary';
import { SupportedByOcmLogo, CartHeader } from '../../static/img';
import PaypalSmartButton from './PaypalSmartButton';

const routes = require('next-routes')();

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  field: {
    height: 44,
    textTransformation: 'none'
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  flexbox: {
    display: 'flex'
  },
  typoButton: {
    color: theme.palette.common.grey['800'],
    textDecoration: 'underline',
    cursor: 'pointer',

    '&:hover': {
      fontWeight: 600
    }
  },
  divider: {
    width: '100%',
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  },
  img: {
    marginRight: theme.spacing.unit
  },
  bottomLogo: {
    paddingTop: theme.spacing.unit * 3
  },
  button: {
    height: 40,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    backgroundColor: theme.palette.common.grey[600],
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.common.grey[600]
    }
  },
  endorsedButton: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  primaryButton: {
    textTransform: 'none',
    borderRadius: 0,

    '&:hover': {
      backgroundColor: theme.palette.common.grey['100']
    }
  },
  icon: {
    height: 32,
    width: 32,
    marginRight: theme.spacing.unit
  },
  error: {
    color: theme.palette.common.error
  },
  typography: {
    color: theme.palette.common.grey['800'],
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontSize: 18,
    fontWeight: 400,

    '&.productTitle': {
      fontSize: 18,
      fontWeight: 'bold'
    },

    '&.title': {
      fontSize: 28
    }
  },
  positionRelative: {
    position: 'relative',
    overflow: 'hidden'
  }
});

const OrderSummaryContainer = props => {
  const { classes } = props;
  const [promoCode, setPromoCode] = useState('');

  return (
    <CheckoutConsumer>
      {({
        currentStep,
        schoolcode,
        order,
        handlePromoCode,
        couponCode,
        handlePlaceOrder,
        orderMessage,
        paymentMethod,
        completed,
        promoError,
        setPromoError,
        isProceeding
      }) => {
        const totalPrice = order.total;
        const subTotalPrice = order.subtotal;
        const itemCount = order.consignments.reduce(
          (cc, consignment) =>
            cc +
            consignment.shipments.reduce(
              (count, shipment) => count + shipment.items.length,
              0
            ),
          0
        );
        const endorsed = schoolcode.toLowerCase() !== 'ocm';
        const countStr = `${itemCount} Item${itemCount > 1 ? 's' : ''} in Cart`;

        return (
          <OrderSummary>
            {currentStep < 3 && (
              <>
                <Grid
                  item
                  container
                  direction="row"
                  spacing={8}
                  alignItems="center"
                >
                  <Grid item md={9} xs={8}>
                    <InputField
                      placeholder="Promo code"
                      input={{
                        onChange: ev => {
                          setPromoCode(ev.target.value);
                          setPromoError('');
                        }
                      }}
                    />
                  </Grid>
                  <Grid item md={3} xs={4}>
                    <Button
                      className={classes.field}
                      variant="outlined"
                      color="secondary"
                      onClick={handlePromoCode(promoCode)}
                      disabled={promoCode === ''}
                      fullWidth
                    >
                      Apply
                    </Button>
                  </Grid>
                  {promoError && (
                    <Grid item md={12} xs={12}>
                      <Typography className={classes.error}>
                        {promoError}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                <Divider className={classes.divider} />
              </>
            )}
            <Grid
              item
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid className={classes.fieldGroup} item>
                <img
                  src={CartHeader}
                  alt="cart-header-icon"
                  className={classes.icon}
                />
                <Typography className={classes.typography}>
                  {countStr}
                </Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item container>
              {couponCode && (
                <Grid item md={12} xs={12}>
                  <Typography variant="caption" gutterBottom>
                    {`Coupon code ${couponCode} applied.`}
                  </Typography>
                </Grid>
              )}
              <Grid item container justify="space-between">
                <Typography className={classes.typography}>
                  Subtotal
                  <span>
                    {` (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}
                  </span>
                </Typography>
                <Typography className={classes.typography}>
                  {numeral(subTotalPrice).format('$0,0.00')}
                </Typography>
              </Grid>
              {order.discount > 0 && (
                <Grid item container justify="space-between">
                  <Typography className={classes.typography}>
                    Discount
                  </Typography>
                  <Typography className={classes.typography}>
                    {`-${numeral(order.discount).format('$0,0.00')}`}
                  </Typography>
                </Grid>
              )}
              <Grid item container justify="space-between">
                <Typography className={classes.typography}>Shipping</Typography>
                <Typography className={classes.typography}>
                  {numeral(order.shipping).format('$0,0.00')}
                </Typography>
              </Grid>
              <Grid item container justify="space-between">
                <Typography className={classes.typography}>
                  Estimated Tax*
                </Typography>
                <Typography className={classes.typography}>
                  {numeral(order.tax).format('$0,0.00')}
                </Typography>
              </Grid>
              <Grid item md={12} xs={12}>
                <Divider className={classes.divider} />
              </Grid>
              <Grid container justify="space-between">
                <Typography className={classes.typography}>Total</Typography>
                <Typography className={classes.typography}>
                  {numeral(totalPrice).format('$0,0.00')}
                </Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            {currentStep < 3 && (
              <>
                <Grid item container direction="column" spacing={16}>
                  <Grid item className={classes.positionRelative}>
                    {orderMessage !== '' && (
                      <Typography className={classes.error} align="right">
                        {orderMessage}
                      </Typography>
                    )}
                    {!completed[2] && (
                      <>
                        <Button
                          className={classNames(
                            classes.button,
                            endorsed ? classes.endorsedButton : ''
                          )}
                          variant="contained"
                          color="primary"
                          fullWidth
                          disabled={currentStep < 2 || isProceeding}
                          onClick={handlePlaceOrder}
                        >
                          Place Order
                        </Button>
                        {paymentMethod.type === 'paypal' && !completed[2] && (
                          <PaypalSmartButton
                            orderId={order.id}
                            id="summary-paypal-button"
                            handlePlaceOrder
                          />
                        )}
                      </>
                    )}
                  </Grid>
                  {currentStep === 2 && (
                    <Grid item>
                      <Typography
                        className={classNames(
                          classes.flexbox,
                          classes.typography
                        )}
                      >
                        By placing your order, you agree to OCM's&nbsp;
                        {/* <Link
                          href={`/${
                            endorsed ? `${schoolcode}/` : ''
                          }privacy-policy`}
                          disabled={isProceeding}
                        >
                          <a target="_blank">
                            <Typography
                              className={classNames(classes.typoButton)}
                            > */}
                        Privacy Policy
                        {/* </Typography>
                          </a>
                        </Link> */}
                        &nbsp;and&nbsp;
                        {/* <Link
                          href={`/${
                            endorsed ? `${schoolcode}/` : ''
                          }terms-and-conditions`}
                        >
                          <a target="_blank">
                            <Typography
                              className={classNames(classes.typoButton)}
                            > */}
                        Terms & Conditions.
                        {/* </Typography>
                          </a>
                        </Link> */}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                <Divider className={classes.divider} />
              </>
            )}
            {completed[2] && (
              <Grid item md={12}>
                <Button
                  className={classNames(
                    classes.button,
                    endorsed ? classes.endorsedButton : ''
                  )}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    routes.Router.push(
                      `/${schoolcode.toLowerCase() !== 'ocm' ? schoolcode : ''}`
                    )
                  }
                >
                  Continue Shopping
                </Button>
              </Grid>
            )}
            {schoolcode !== 'ocm' && (
              <Grid
                container
                alignItems="flex-start"
                justify="center"
                direction="row"
                className={classes.bottomLogo}
              >
                <img src={SupportedByOcmLogo} alt="Supported by OCM" />
              </Grid>
            )}
          </OrderSummary>
        );
      }}
    </CheckoutConsumer>
  );
};

export default withStyles(styles)(OrderSummaryContainer);
