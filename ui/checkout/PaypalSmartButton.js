import React, { useEffect, useContext } from 'react';
import { graphql, compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';

import { getPaypalOrder } from '../../src/graphql/checkout';
import CheckoutContext from './context';

const styles = () => ({
  showBtn: {
    width: '250%',
    height: 44,
    display: 'flex',
    position: 'absolute',
    top: 8,
    opacity: 0.01,

    '& > div': {
      height: '100% !important'
    }
  }
});

const PaypalSmartButton = props => {
  const { classes, orderId, id } = props;
  const { handlePlaceOrder } = useContext(CheckoutContext);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { paypal } = window;
      paypal
        .Buttons({
          async createOrder() {
            const res = await props.getPaypalOrder({
              variables: {
                orderId
              }
            });

            if (res.data.getPaypalOrder.success) {
              return res.data.getPaypalOrder.paypalOrderId;
            }
            return -1;
          },
          async onApprove() {
            handlePlaceOrder();
          },
          style: {
            color: 'black',
            tagline: false,
            fundingicons: false,
            layout: 'vertical',
            label: 'checkout'
          }
        })
        .render(`#${id}`);
    }
  });

  return <div id={id} className={classes.showBtn} />;
};

export default compose(
  graphql(getPaypalOrder, { name: 'getPaypalOrder' }),
  withStyles(styles)
)(PaypalSmartButton);
