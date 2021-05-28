import { Grid, Typography, Button, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import numeral from 'numeral';
import classNames from 'classnames';

import { CartConsumer } from './context';
import OrderSummary from '../../components/OrderSummary';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  field: {
    height: 44,
    textTransform: 'none'
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  subtitle: {
    marginTop: theme.spacing.unit * 3,
    fontFamily: 'Montserrat',
    fontWeight: 'bold'
  },
  divider: {
    width: '100%',
    margin: `${theme.spacing.unit * 3}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  },
  primaryButton: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    margin: `${theme.spacing.unit}px 0`,

    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: 'white'
    }
  },
  button: {
    borderRadius: 4,
    height: 40,
    border: `2px solid ${theme.palette.secondary.main}`,
    fontFamily: 'montserrat',
    fontWeight: 600
  },
  secondaryButton: {
    color: theme.palette.secondary.main,
    backgroundColor: 'white',

    '&:hover': {
      color: theme.palette.secondary.main,
      backgroundColor: 'white'
    }
  },
  transButton: {
    cursor: 'pointer',
    textTransform: 'none',
    textDecoration: 'underline',
    color: theme.palette.secondary.main,
    fontFamily: 'Montserrat',
    fontWeight: 400,
    paddingLeft: 0,

    '&:hover': {
      fontWeight: 600,
      textDecoration: 'underline'
    }
  }
});

const OrderSummaryContainer = props => {
  const { classes } = props;

  return (
    <CartConsumer>
      {({ items, createCheckout }) => {
        const totalPrice =
          items &&
          items
            .reduce((price, item) => price + item.quantity * item.unitPrice, 0)
            .toFixed(2);

        return (
          <OrderSummary>
            <Grid item container direction="column">
              <Grid item container justify="space-between">
                <Typography className={classes.subtitle}>
                  Subtotal
                  <span>
                    {` (${items.length} ${
                      items.length === 1 ? 'item' : 'items'
                    })`}
                  </span>
                </Typography>
                <Typography className={classes.subtitle}>
                  {numeral(totalPrice).format('$0,0.00')}
                </Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item container direction="column" spacing={16}>
              <Grid item>
                <Button
                  className={classNames(classes.button, classes.primaryButton)}
                  color="secondary"
                  variant="contained"
                  onClick={createCheckout}
                  fullWidth
                >
                  Proceed to Checkout
                </Button>
              </Grid>
              {/* <Grid item>
                <Typography variant="caption">
                  Have an account? Sign in and save time.
                </Typography>
                <Button
                  className={classNames(
                    classes.button,
                    classes.secondaryButton
                  )}
                  color="secondary"
                  variant="outline"
                  fullWidth
                >
                  Sign In
                </Button>
              </Grid>
              <Grid item>
                <Typography variant="caption">
                  New Customer?&nbsp;
                  <span className={classes.transButton}>Start here.</span>
                </Typography>
              </Grid> */}
            </Grid>
          </OrderSummary>
        );
      }}
    </CartConsumer>
  );
};

export default withStyles(styles)(OrderSummaryContainer);
