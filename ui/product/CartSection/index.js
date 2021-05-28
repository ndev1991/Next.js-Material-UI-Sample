import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import CartPromo from '../../../components/widgets/CartPromo';
import AddToCartButton from '../../../components/widgets/AddToCartButton';
import NumberInput from '../../../components/forms/NumberInput';
import giftIcon from '../../../static/img/icons/gift-outline.svg';
import schoolIcon from '../../../static/img/icons/school-solid.svg';

const cartGiftPromo = 'Gift options available in cart';
const campusDeliveryPromo = 'Campus delivery available!';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing.unit * 3
    }
  },
  button: {
    marginBottom: theme.spacing.unit * 3,
    [theme.breakpoints.only('xs')]: {
      width: '100%'
    }
  },
  school: {
    width: 32,
    height: 32
  },
  gift: {
    width: 28,
    height: 28
  }
});

const CartSection = ({
  classes,
  onAddToCart,
  onUpdateQuantity,
  campusDelivery,
  giftOptions
}) => (
  <div className={classes.container}>
    {campusDelivery && (
      <div className={classes.item}>
        <CartPromo
          icon={
            <img
              src={schoolIcon}
              alt={campusDeliveryPromo}
              className={classes.school}
            />
          }
          description={campusDeliveryPromo}
        />
      </div>
    )}
    {giftOptions && (
      <div className={classes.item}>
        <CartPromo
          icon={
            <img src={giftIcon} alt={cartGiftPromo} className={classes.gift} />
          }
          description={cartGiftPromo}
        />
      </div>
    )}
    <div className={classes.item}>
      <NumberInput initial={1} min={1} onUpdate={onUpdateQuantity} />
    </div>
    <div className={classes.button}>
      <AddToCartButton fullWidth onClick={onAddToCart} />
    </div>
  </div>
);

CartSection.propTypes = {
  classes: PropTypes.object.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  giftOptions: PropTypes.bool,
  campusDelivery: PropTypes.bool
};

CartSection.defaultProps = {
  giftOptions: false,
  campusDelivery: false
};

export default withStyles(styles)(CartSection);
