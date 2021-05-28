import React, { useContext, useState } from 'react';
import { Hidden, Grid, Typography, Divider, Button } from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import classNames from 'classnames';

import CheckoutContext from './context';
import InputField from '../../components/forms/InputField';

const ShipmentDetails = ({
  classes,
  page,
  shippingAddress,
  billingAddress,
  isMultiple,
  paymentMethod,
  gotoStep,
  changePayment,
  endorsed
}) => {
  const { setPromoError, promoError, handlePromoCode } = useContext(
    CheckoutContext
  );
  const [promoCode, setPromoCode] = useState('');

  return (
    <>
      <Hidden smDown>
        <Grid item container spacing={8} justify="space-between">
          <Grid item md={4}>
            <Typography
              className={classNames(classes.typography, 'productTitle')}
              gutterBottom
            >
              SHIPPING ADDRESS
            </Typography>
            {isMultiple && (
              <Typography className={classes.typography}>
                {shippingAddress}
              </Typography>
            )}
            {!isMultiple && (
              <Grid item container alignItems="flex-start" xs={10}>
                <Grid item xs={2}>
                  <PlaceIcon />
                </Grid>
                <Grid item xs={10} className={classes.normalText}>
                  {!JSON.parse(shippingAddress[0].type).isCampusDelivery && (
                    <>
                      <Typography className={classes.typography}>
                        {shippingAddress[0].address.address}
                      </Typography>
                      <Typography className={classes.typography}>
                        {shippingAddress[0].address.apt}
                      </Typography>
                      <Typography className={classes.typography} gutterBottom>
                        {`${shippingAddress[0].address.city}, ${
                          shippingAddress[0].address.state
                        } ${shippingAddress[0].address.zip}`}
                      </Typography>
                    </>
                  )}
                  {JSON.parse(shippingAddress[0].type).isCampusDelivery && (
                    <>
                      <Typography className={classes.typography}>
                        Campus Delivery
                      </Typography>
                      <Typography className={classes.typography}>
                        {endorsed && shippingAddress[0].student.school}
                      </Typography>
                      <Typography className={classes.typography}>
                        {shippingAddress[0].address.resHall}
                      </Typography>
                      <Typography className={classes.typography} gutterBottom>
                        {`${
                          shippingAddress[0].address.roomNo
                        }${shippingAddress[0].address.roomNo &&
                          shippingAddress[0].address.campusBox &&
                          ', '}${shippingAddress[0].address.campusBox}`}
                      </Typography>
                    </>
                  )}
                  <Typography
                    className={classes.typoButton}
                    onClick={gotoStep(0)}
                  >
                    Change
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
          {paymentMethod.type !== 'paypal' && (
            <Grid item md={4}>
              <Typography
                className={classNames(classes.typography, 'productTitle')}
                gutterBottom
              >
                PAYMENT METHOD
              </Typography>
              <Typography className={classes.typography}>
                {`${paymentMethod.cardInfo.paymentMethod}
                  ending in ${paymentMethod.cardInfo.ccNumber &&
                    paymentMethod.cardInfo.ccNumber.slice(
                      paymentMethod.cardInfo.ccNumber.length - 4,
                      paymentMethod.cardInfo.ccNumber.length
                    )}`}
              </Typography>
              <Typography className={classes.typography} gutterBottom>
                {`Exp: ${paymentMethod.cardInfo.ccExpMonth} / ${
                  paymentMethod.cardInfo.ccExpYear
                }`}
              </Typography>
              <Typography
                className={classes.typoButton}
                onClick={changePayment}
              >
                Change
              </Typography>
            </Grid>
          )}
          {paymentMethod.type === 'paypal' && (
            <Grid item md={4}>
              <Typography
                className={classNames(classes.typography, 'productTitle')}
                gutterBottom
              >
                PAYMENT METHOD
              </Typography>
              <Typography className={classes.typography} gutterBottom>
                Paypal
              </Typography>
            </Grid>
          )}
          <Grid item md={4}>
            <Typography
              className={classNames(classes.typography, 'productTitle')}
              gutterBottom
            >
              BILLING ADDRESS
            </Typography>
            {paymentMethod.type === 'paypal' && (
              <Typography className={classes.typography}>PayPal</Typography>
            )}
            {paymentMethod.type !== 'paypal' && (
              <>
                {billingAddress.id === shippingAddress[0].id ? (
                  <Typography className={classes.typography}>
                    Same as shiping address
                  </Typography>
                ) : (
                  <Grid item container alignItems="flex-start" xs={10}>
                    <Grid item xs={2}>
                      <PlaceIcon />
                    </Grid>
                    <Grid item xs={10} className={classes.normalText}>
                      <Typography className={classes.typography}>
                        {billingAddress.address}
                      </Typography>
                      <Typography className={classes.typography}>
                        {billingAddress.apt}
                      </Typography>
                      <Typography className={classes.typography} gutterBottom>
                        {`${billingAddress.city}, ${billingAddress.state} ${
                          billingAddress.zip
                        }`}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </>
            )}
            <Typography className={classes.typoButton} onClick={changePayment}>
              Change
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.divider} />
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Grid item container>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Shipping Address
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" onClick={gotoStep(0)} fullWidth>
              <Grid
                container
                spacing={8}
                alignItems="center"
                justify="space-between"
              >
                {isMultiple && (
                  <Grid item xs={10}>
                    <Typography className={classes.typography}>
                      {shippingAddress}
                    </Typography>
                  </Grid>
                )}
                {!isMultiple && (
                  <Grid item container alignItems="flex-start" xs={10}>
                    <Grid item xs={2}>
                      <PlaceIcon />
                    </Grid>
                    <Grid item xs={10} className={classes.normalText}>
                      {!JSON.parse(shippingAddress[0].type)
                        .isCampusDelivery && (
                        <>
                          <Typography className={classes.typography}>
                            {shippingAddress[0].address.address}
                          </Typography>
                          <Typography className={classes.typography}>
                            {shippingAddress[0].address.apt}
                          </Typography>
                          <Typography
                            className={classes.typography}
                            gutterBottom
                          >
                            {`${shippingAddress[0].address.city}, ${
                              shippingAddress[0].address.state
                            } ${shippingAddress[0].address.zip}`}
                          </Typography>
                        </>
                      )}
                      {JSON.parse(shippingAddress[0].type).isCampusDelivery && (
                        <>
                          <Typography className={classes.typography}>
                            Campus Delivery
                          </Typography>
                          <Typography className={classes.typography}>
                            {endorsed && shippingAddress[0].student.school}
                          </Typography>
                          <Typography className={classes.typography}>
                            {shippingAddress[0].address.resHall}
                          </Typography>
                          <Typography
                            className={classes.typography}
                            gutterBottom
                          >
                            {`${
                              shippingAddress[0].address.roomNo
                            }${shippingAddress[0].address.roomNo &&
                              shippingAddress[0].address.campusBox &&
                              ', '}${shippingAddress[0].address.campusBox}`}
                          </Typography>
                        </>
                      )}
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={2}>
                  <ArrowForwardIcon />
                </Grid>
              </Grid>
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item container spacing={8} direction="column">
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Payment Information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" onClick={changePayment} fullWidth>
              <Grid
                container
                spacing={8}
                alignItems="center"
                justify="space-between"
              >
                {paymentMethod.type !== 'paypal' && (
                  <Grid item xs={10} className={classes.normalText}>
                    <Typography
                      className={classNames(classes.typography, 'productTitle')}
                    >
                      Payment Method
                    </Typography>
                    <Typography className={classes.typography}>
                      {`${paymentMethod.cardInfo.paymentMethod}
                        ending in ${paymentMethod.cardInfo.ccNumber &&
                          paymentMethod.cardInfo.ccNumber.slice(
                            paymentMethod.cardInfo.ccNumber.length - 4,
                            paymentMethod.cardInfo.ccNumber.length
                          )}`}
                    </Typography>
                    <Typography className={classes.typography} gutterBottom>
                      {`Exp: ${paymentMethod.cardInfo.ccExpMonth} / ${
                        paymentMethod.cardInfo.ccExpYear
                      }`}
                    </Typography>
                  </Grid>
                )}
                {paymentMethod.type === 'Paypal' && (
                  <Grid item md={4}>
                    <Typography
                      className={classNames(classes.typography, 'productTitle')}
                      gutterBottom
                    >
                      PAYMENT METHOD
                    </Typography>
                    <Typography className={classes.typography} gutterBottom>
                      Paypal
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={2}>
                  <ArrowForwardIcon />
                </Grid>
              </Grid>
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" onClick={changePayment} fullWidth>
              <Grid
                container
                spacing={8}
                alignItems="center"
                justify="space-between"
              >
                <Grid item xs={10} className={classes.normalText}>
                  <Typography
                    className={classNames(classes.typography, 'productTitle')}
                  >
                    Billing Address
                  </Typography>
                  {paymentMethod.type === 'paypal' && (
                    <Typography className={classes.typography}>
                      PayPal
                    </Typography>
                  )}
                  {paymentMethod.type !== 'paypal' && (
                    <>
                      {billingAddress.id === shippingAddress[0].id ? (
                        <Typography className={classes.typography}>
                          Same as shiping address
                        </Typography>
                      ) : (
                        <Grid item container alignItems="flex-start" xs={10}>
                          <Grid item xs={2}>
                            <PlaceIcon />
                          </Grid>
                          <Grid item xs={10} className={classes.normalText}>
                            <Typography className={classes.typography}>
                              {billingAddress.address}
                            </Typography>
                            <Typography className={classes.typography}>
                              {billingAddress.apt}
                            </Typography>
                            <Typography
                              className={classes.typography}
                              gutterBottom
                            >
                              {`${billingAddress.city}, ${
                                billingAddress.state
                              } ${billingAddress.zip}`}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <ArrowForwardIcon />
                </Grid>
              </Grid>
            </Button>
          </Grid>
          {page === 'placeOrder' && (
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
                    },
                    value: promoCode
                  }}
                />
              </Grid>
              <Grid item md={3} xs={4}>
                <Button
                  className={classes.field}
                  variant="outlined"
                  color="secondary"
                  disabled={promoCode === ''}
                  onClick={handlePromoCode(promoCode)}
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
          )}
        </Grid>
        <Grid item>
          <Divider className={classes.divider} />
        </Grid>
      </Hidden>
    </>
  );
};

export default ShipmentDetails;
